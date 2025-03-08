const fs = require("fs");
const path = require("path");

const directoryPath = "c:\\Users\\alego\\Desktop\\Ale\\Dev\\gestionale-wasabi\\app\\(site)"; // Update this path

const actionsToReplace = [
  "updateProduct",
  "updateAdditionalNote",
  "updateProductInOrder",
  "updateProductOptionsInOrder",
  "toggleProduct",
  "updatePrintedAmounts",
];

function replaceInFile(filePath) {
  let fileContent = fs.readFileSync(filePath, "utf8");

  actionsToReplace.forEach((action) => {
    // Capture optional generic type, the second parameter (URL), and the action name
    const regex = new RegExp(`fetchRequest(<[^>]+>)?\\("POST",\\s*(".*?"),\\s*"${action}"`, "g");

    // Replace while keeping the generic type and captured URL intact
    fileContent = fileContent.replace(regex, `fetchRequest$1("PATCH", $2, "${action}"`);
  });

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function traverseDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      replaceInFile(fullPath);
    }
  });
}

traverseDirectory(directoryPath);
