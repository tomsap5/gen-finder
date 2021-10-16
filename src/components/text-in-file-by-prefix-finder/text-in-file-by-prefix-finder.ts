import { readUniqueTreeByPrefix } from "./read-unique-tree-by-prefix";
import { UniqDescendantsTree } from "./uniq-descendants-tree";

export class TextInFileByPrefixFinder {
  private readonly findSuffixRegex: RegExp;
  private suffixTree: UniqDescendantsTree<string>;

  constructor(private prefix: string) {
    this.findSuffixRegex = new RegExp(`(${this.prefix})(.+)`);
  }

  async initializeRead(filePath: string) {
    this.suffixTree = await readUniqueTreeByPrefix({ prefix: this.prefix, filePath });
  }

  isTextFoundInFile(text: string): boolean {
    const suffix = this.getTextSuffix(text);
    if (!this.didFinishReadingFile) {
      throw new Error("file reading still in process"); // TODO define relevant error
    }
    return this.suffixTree.findPathInTree([...suffix]);
  }

  private getTextSuffix(text: string): string {
    const match = text.match(this.findSuffixRegex);
    if (!match) {
      throw new Error("prefix not found in text"); // TODO define relevant error
    }
    return match[2];
  }

  get didFinishReadingFile(): boolean {
    return !!this.suffixTree;
  }
}
