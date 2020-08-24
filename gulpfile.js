const gulp = require('gulp');
const through2 = require('through2');
const fs = require('fs');

const basePath = 'assets/';
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

gulp.task('assets', (done) => gulp.series(init, 'assets:images', 'assets:fonts', write)(done));
