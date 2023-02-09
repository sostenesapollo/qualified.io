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

module.exports = prioritizeNodes