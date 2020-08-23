
export class ResourcesParser implements Parser.IResourcesParser {
    rules: Parser.IParserRules;

    constructor() {
        this.rules = {
            json: new RegExp(/json$/, "i"),
            json_img: new RegExp(/_image*$/, "i"),
            img: new RegExp(/(jpg|jpeg|png)$/, "i")
        };
    }

    parseResources(resources: Parser.IParserInput): Parser.IParserResult {
        const keys: string[] = Object.keys(resources);

        return {
            ...this._parseSprites(keys, resources),
            ...this._parseSpritesheet(keys, resources)
        };
    }

    _parseSprites(keys: string[], resources: Parser.IParserInput): Parser.IParserResult {
        return keys.reduce((acc: Parser.IParserResult, key: string) => {
            if (this.rules.img.test(resources[key].extension)) {
                acc[key] = resources[key].texture;
            }
            return acc
        }, {});
    }

    _parseSpritesheet(keys: string[], resources: Parser.IParserInput): Parser.IParserResult {
        return keys.reduce((acc: Parser.IParserResult, key: string) => {
            if (this.rules.json.test(resources[key].extension)) {
                const { textures = [] } = resources[key];
                (<any>Object).entries(textures)
                    //@ts-ignore
                    .forEach(([name, texture]) => (acc[name] = texture));
            }
            return acc
        }, {});
    }
}