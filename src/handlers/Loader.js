const path = require("path");
const fs = require("fs-extra");

/**
 * Generic file loader utilities.
 */
class Loader {
  /**
   * Load all JS modules from a directory.
   * @param {string} dirAbs absolute directory
   * @returns {Array<any>}
   */
  static loadModulesFromDir(dirAbs) {
    if (!fs.existsSync(dirAbs)) return [];

    const files = fs
      .readdirSync(dirAbs)
      .filter((f) => f.endsWith(".js"));

    const modules = [];
    for (const file of files) {
      const full = path.join(dirAbs, file);
      const mod = require(full);
      modules.push(mod);
    }

    return modules;
  }

  /**
   * Load all JS modules recursively.
   * @param {string} dirAbs
   * @returns {Array<any>}
   */
  static loadModulesRecursive(dirAbs) {
    if (!fs.existsSync(dirAbs)) return [];

    const files = fs
      .readdirSync(dirAbs)
      .flatMap((f) => {
        const full = path.join(dirAbs, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) return Loader._collectJsFiles(full);
        if (stat.isFile() && f.endsWith(".js")) return [full];
        return [];
      });

    return files.map((p) => require(p));
  }

  static _collectJsFiles(dirAbs) {
    const items = fs.readdirSync(dirAbs);
    const out = [];
    for (const item of items) {
      const full = path.join(dirAbs, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) out.push(...Loader._collectJsFiles(full));
      else if (stat.isFile() && item.endsWith(".js")) out.push(full);
    }
    return out;
  }
}

module.exports = { Loader };

