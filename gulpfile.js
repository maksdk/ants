const gulp = require('gulp');
const del = require('del');
const through2 = require('through2');
const fs = require('fs');
const texturePacker = require('gulp-free-tex-packer');
const has = require('lodash/has');

const basePath = 'assets/';
const tempAtlasesPath = `${basePath}__temp_atlases__`;
const writePath = './assets.ts';
const imagesExts = ['jpg', 'jpeg', 'png', 'gif'];
const fontsExts = ['ttf', 'otf'];

let assets = {};

const getExtFromPath = (path) => {
    let tmp = path.split('.');
    return tmp[tmp.length - 1].toLowerCase();
};

const getNameFromPath = (path) => {
    let name = path.split('.');
    name.pop();
    name = name.join('.');
    return name;
};

const fixPath = (path) => {
    return path.split('\\').join('/');
};

function isJson(name) {
    return /.*\.json$/.test(name);
}

function isImage(name) {
    return /.*\.png|jpg$/.test(name);
}

function getName(path) {
    var name = path.split('.');
    name.pop();
    name = name.join('.');
    return name;
}

const init = (done) => {
    assets = {};
    done();
};

const write = (done) => {
    fs.writeFileSync(writePath, `export default ${JSON.stringify(assets, null, 4)};`);
    assets = {};
    done();
};

gulp.task('assets:images', () => {
    assets.images = [];
    return gulp.src(`${basePath}images/**/*.*`).pipe(
        through2.obj(function (file, enc, done) {
            const path = fixPath(file.relative.toString());
            const name = getNameFromPath(path);
            const ext = getExtFromPath(path);

            if (!imagesExts.includes(ext)) {
                throw new Error(`Such image extension: "${ext}" is not found !!!`);
            }

            assets.images.push({
                name,
                url: `${basePath}images/${path}`
            });

            done(null, file);
        })
    );
});

gulp.task('assets:fonts', () => {
    assets.fonts = [];
    return gulp.src(`${basePath}fonts/**/*.*`).pipe(
        through2.obj(function (file, enc, done) {
            const path = fixPath(file.relative.toString());
            const name = getNameFromPath(path);
            const ext = getExtFromPath(path);

            if (!fontsExts.includes(ext)) {
                throw new Error(`Such font extension: "${ext}" is not found !!!`);
            }

            assets.fonts.push({
                name,
                url: `${basePath}fonts/${path}`
            });
            done(null, file);
        })
    );
});

gulp.task('assets:atlases', () => {
    assets.atlases = [];
    return gulp
        .src(`${basePath}atlases/**/*.*`)
        .pipe(
            texturePacker({
                textureName: 'atlas',
                packer: 'OptimalPacker',
                packerMethod: 'Automatic',
                width: 2048,
                height: 2048,
                fixedSize: false,
                padding: 2,
                allowRotation: true,
                detectIdentical: true,
                allowTrim: true,
                exporter: 'Pixi',
                removeFileExtension: true,
                prependFolderName: true
            })
        )
        .pipe(gulp.dest(tempAtlasesPath))
        .pipe(
            through2.obj((file, enc, cb) => {
                const files = fs.readdirSync(tempAtlasesPath);
                const jsons = files.filter((name) => isJson(name));

                jsons.forEach((jsonFileName) => {
                    const content = JSON.parse(fs.readFileSync(`${tempAtlasesPath}/${jsonFileName}`, 'utf-8'));
                    assets.images.forEach((image) => {
                        if (has(content.frames, image.name)) {
                            throw new Error(
                                `The atlases folder and the images folder have the same name: "${image.name}"`
                            );
                        }
                    });
                });

                assets.atlases = jsons.map((jsonFileName) => {
                    return {
                        name: getName(jsonFileName),
                        url: `${tempAtlasesPath}/${jsonFileName}`
                    };
                });
                cb(null);
            })
        );
});

gulp.task('clear', () => {
    return del([tempAtlasesPath]);
});

gulp.task('assets', (done) =>
    gulp.series(init, 'clear', 'assets:images', 'assets:atlases', 'assets:fonts', write)(done)
);
