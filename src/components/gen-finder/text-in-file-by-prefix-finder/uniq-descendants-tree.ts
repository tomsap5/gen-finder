export class UniqDescendantsTree<ValueType> {
  private descendants: UniqDescendantsTree<ValueType>[] = [];

  constructor(private value: ValueType = undefined) {}

  addUniqueDescendant(value: ValueType): UniqDescendantsTree<ValueType> {
    const uniqDescendantsIndex = this.findDirectDescendantIndex(value);
    return uniqDescendantsIndex !== -1
      ? this.descendants[uniqDescendantsIndex]
      : this.addDescendant(value);
  }

  clearSpecificPath(path: ValueType[]) {
    if (!path.length) {
      return;
    }
    const [firstPathValue] = path.splice(0, 1);
    const index = this.findDirectDescendantIndex(firstPathValue);
    if (index === -1) {
      return;
    }
    const [splicedValue] = this.descendants.splice(index, 1);
    return splicedValue.clearSpecificPath(path);
  }

  findPathInTree(path: ValueType[], tree: UniqDescendantsTree<ValueType> = this): boolean {
    if (!path.length) {
      return true;
    }
    const [firstPathValue] = path.splice(0, 1);
    const index = tree.findDirectDescendantIndex(firstPathValue);
    if (index === -1) {
      return false;
    }
    return tree.findPathInTree(path, tree.descendants[index]);
  }

  private findDirectDescendantIndex(value: ValueType): number {
    return this.descendants.findIndex((descendant) => descendant.value === value);
  }

  private addDescendant(value: ValueType) {
    const uniqDescendantsTree = new UniqDescendantsTree(value);
    this.descendants.push(uniqDescendantsTree);
    return uniqDescendantsTree;
  }
}
