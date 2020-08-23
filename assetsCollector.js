// @ts-check
const path = require("path");
const fs = require("fs");

/**
 * @typedef {{[key: string]: string}} IStringConfig
 * @typedef {{[key: string]: RegExp}} IRulesConfig
 * @typedef {(value: any) => boolean} IChecker
 */

/**
 * @type IStringConfig
 */
const PATHS = {
    PROJECT_FOLDER: "./",
    ASSETS_FOLDER: "assets",
    UPLOAD_FOLDER: path.join(__dirname, "assets")
};

/**
 * @type IStringConfig
 */
const ASSETS_TYPES = {
    SPRITES: "sprites",
    SPRITESHEET: "spritesheet"
};

/**
 * @type IRulesConfig
 */
const RULES = {
    json: new RegExp(/\.json$/, "i"),
    img: new RegExp(/\.(jpg|jpeg|png)$/, "i"),
    name: new RegExp(/[a-zA-Z]+\.(jpg|jpeg|png|json)$/i)
};

/**
 * @param {IChecker} rule
 * @param {string} rootFolder
 * @returns {Array<{name: string; url: string;}>} 
 */
const makeConfig = (rule, rootFolder, assetsFolder) => {
    const collection = [];
    const fullPath = path.join(__dirname, rootFolder, assetsFolder);
    const fileNames = fs.readdirSync(fullPath, "utf-8");

    fileNames.forEach((fileName) => {
        const stats = fs.lstatSync(path.join(fullPath, fileName));

        if (rule(fileName)) {
            const [name] = fileName.split(".");
            const url = path.join(assetsFolder, fileName);
            collection.push({
                name,
                url
            });
        }
        else if (stats.isDirectory()) {
            collection.push(...makeConfig(rule, rootFolder, path.join(assetsFolder, fileName)));
        }
    });
    return collection;
};

console.log(`[Assets Collector: start collecting for new assets.json file]`);
/* Remove assets.json file if it exists */
const assetsFile = path.join(PATHS.UPLOAD_FOLDER, "assets.json");
if (fs.existsSync(assetsFile)) {
    fs.unlinkSync(assetsFile);
    console.log(`[Assets Collector: an old assets.json removed before collecting new one]`);
}

/**
 * @type IChecker
 * @param {string} fileName
 * @returns {boolean} 
 */
const spritesRule = (fileName) => RULES.img.test(fileName);
const sprites = makeConfig(spritesRule, PATHS.PROJECT_FOLDER, path.join(PATHS.ASSETS_FOLDER, ASSETS_TYPES.SPRITES));

/**
 * @type IChecker
 * @param {string} fileName
 * @returns {boolean} 
 */
const spritesheetRule = (fileName) => RULES.json.test(fileName);
const spritesheet = makeConfig(spritesheetRule, PATHS.PROJECT_FOLDER, path.join(PATHS.ASSETS_FOLDER, ASSETS_TYPES.SPRITESHEET));

fs.writeFileSync(
    path.join(PATHS.UPLOAD_FOLDER, "assets.json"),
    JSON.stringify({
        sprites,
        spritesheet
    }, null, 2),
    "utf-8"
);

console.log(`[Assets Collector: finish collecting, a new  assets.json has been created]`);