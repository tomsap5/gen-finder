import fs from "fs";
import es from "event-stream";
import { UniqDescendantsTree } from "./uniq-descendants-tree";

export async function readUniqueTreeByPrefix({
  prefix,
  filePath,
}: {
  prefix: string;
  filePath: string;
}): Promise<UniqDescendantsTree<string>> {
  const treeRoot = new UniqDescendantsTree<string>();
  let prefixSequence = "";
  let prefixIndex = 0;
  let uniqDescendantsTree = treeRoot;
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(es.split())
      .pipe(
        es
          .map(function (line: string, cb: (err, value) => void) {
            for (const currentChar of line) {
              if (currentChar === prefix[prefixIndex]) {
                prefixSequence += currentChar;
              } else {
                prefixSequence = "";
                prefixIndex = 0;
              }
              uniqDescendantsTree = uniqDescendantsTree.addUniqueDescendant(currentChar);
              if (prefixSequence.length === prefix.length) {
                uniqDescendantsTree = treeRoot;
              }
            }
            cb(null, null);
          })
          .on("error", function (err) {
            console.log("Error while reading file.", err);
            reject(err);
          })
          .on("end", function () {
            console.log("Read entire file.");
            treeRoot.clearSpecificPath([...prefix]);
            resolve(treeRoot);
          })
      );
  });
}
