Consider the following recursively-defined tree structure represented as JSON:

{
  "val": 1,
  "children": [
    {"val": 2},
    {
      "val": 3,
      "children": [
        {
          "val": 4,
          "children": [
            {"val": 5},
            {"val": 6},
            {"val": 7}
          ]
        }
      ]
    }
  ]
}
Here, each node in the tree is an object with a required "val" property that maps to a non-unique integer and an optional "children" property that, if present, maps to an array of child nodes.

This challenge involves writing a function prioritizeNodes(tree, targetVal) which accepts a valid nested tree object conforming to the above definition. The function should sort all "children" arrays containing one or more nodes with node.val === targetVal to the front of the array. For the above tree, the output for a call to prioritizeNodes(tree, 7) would be:

{
  "val": 1,
  "children": [
    {
      "val": 3, // <-- moved up
      "children": [
        {
          "val": 4,
          "children": [
            {"val": 7}, // <-- moved up
            {"val": 5},
            {"val": 6}
          ]
        }
      ]
    },
    {"val": 2}
  ]
}
Each node in a tree with a value or child matching the target was moved to the front of its respective array.

Non-prioritized nodes should be kept in their original relative ordering with respect to one another, and prioritized nodes which were moved to the front of an array should also maintain order with respect to other priority nodes in the array. Your function may mutate the parameter tree in-place in addition to returning it if you wish.

```
const prioritizeNodes = (tree, targetVal) => {
    const recursive = ({val, children}) => {
        if (!children) {
            return [{ val }, val === targetVal];
        }
        let categories = [[], []], isPrioritized;
        for (let child of children) {
            [child, isPrioritized] = recursive(child);
            categories[1-isPrioritized].push(child);
        }
        return [
            { val, children: categories.flat() },
            categories[0].length > 0 || val === targetVal
        ];
    }
    return recursive(tree)[0];
}
```

```
const chai = require("chai");
const assert = chai.assert;
chai.config.truncateThreshold = 0;

describe("Test Prioritize Node", () => {
  it("should work on a basic example", () => {
    const tree = {
      val: 1,
      children: [
        {val: 2},
        {
          val: 3,
          children: [
            {
              val: 4,
              children: [
                {val: 5},
                {val: 6},
                {val: 7}
              ]
            }
          ]
        }
      ]
    };
    const expected = {
      val: 1,
      children: [
        {
          val: 3,
          children: [
            {
              val: 4,  
              children: [
                {val: 7},
                {val: 5},
                {val: 6}
              ]
            }
          ]
        },
        {val: 2}
      ]
    };
    
    const actual = prioritizeNodes(tree, 7);
    assert.deepEqual(actual, expected, stringify(actual, expected));
  });
  
  it("should work when the root has no children", () => {
    const tree = {val: 1};
    const expected = {val: 1};
    const actual = prioritizeNodes(tree, 7);
    assert.deepEqual(actual, expected, stringify(actual, expected));
  });
  
  it("should work when there are multiple children in one array", () => {
    const tree = {
      val: 1,
      children: [
        {
          val: 1,
          children: [
            {val: 7}
          ]
        },
        {
          val: 3,
          children: [
            {val: 55}
          ]
        },
        {
          val: 2,
          children: [
            {val: 15}
          ]
        },
        {
          val: 7,
          children: [
            {val: 2}
          ]
        }
      ]
    };
    
    const expected = {
      val: 1,
      children: [
        {
          val: 2,
          children: [
            {val: 15}
          ]
        },
        {
          val: 7,
          children: [
            {val: 2}
          ]
        },
        {
          val: 1,
          children: [
            {val: 7}
          ]
        },
        {
          val: 3,
          children: [
            {val: 55}
          ]
        }
      ]
    };

    const actual = prioritizeNodes(tree, 2);
    assert.deepEqual(actual, expected, stringify(actual, expected));
  });
  
  it("should work on a larger example", () => {
    const tree = {
      val: 1,
      children: [
        {
          val: 2,
          children: [
            {
              val: 7,
              children: [
                {val: 2},
                {val: 18},
                {val: 12}
              ]
            }
          ]
        },
        {
          val: 4,
          children: [
            {val: 5},
            {
              val: 6,
              children: [
                {val: 12},
                {val: 11},
                {val: 10},
                {val: 9},
              ]
            },
            {val: 13}
          ]
        },
        {
          val: 3,
          children: [
            {val: 15}
          ]
        },
        {
          val: 17,
          children: [
            {val: 16},
            {
              val: 2,
              children: [
                {val: 14},
                {val: 11},
                {
                  val: 18,
                  children: [
                    {val: 4},
                    {val: 11},
                    {val: 7}
                  ]
                },
                {val: 27},
                {val: 18},
                {val: 29},
              ]
            }
          ]
        }
      ]
    };
   
    const expected = {
      val: 1,
      children: [
        {
          val: 2,
          children: [
            {
              val: 7,
              children: [
                {val: 18}, // <-- this moved up
                {val: 2},
                {val: 12}
              ]
            }
          ]
        },
        {
          val: 17, // <-- this moved up
          children: [
            {
              val: 2, // <-- this moved up
              children: [
                {
                  val: 18, // <-- this moved up
                  children: [
                    {val: 4},
                    {val: 11},
                    {val: 7}
                  ]
                },
                {val: 18}, // <-- this moved up
                {val: 14},
                {val: 11},
                {val: 27},
                {val: 29},
              ]
            },
            {val: 16}
          ]
        },
        {
          val: 4,
          children: [
            {val: 5},
            {
              val: 6,
              children: [
                {val: 12},
                {val: 11},
                {val: 10},
                {val: 9},
              ]
            },
            {val: 13}
          ]
        },
        {
          val: 3,
          children: [
            {val: 15}
          ]
        }
      ]
    };

    const actual = prioritizeNodes(tree, 18);
    assert.deepEqual(actual, expected, stringify(actual, expected));
  });
});

const stringify = (actual, expected) => 
`expected your response\n
${JSON.stringify(actual, null, 2)}\n\nto equal\n
${JSON.stringify(expected, null, 2)}\n\n`
;