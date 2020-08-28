const gulp = require('gulp');
const del = require('del');
const through2 = require('through2');
const fs = require('fs');
const texturePacker = require('gulp-free-tex-packer');

const basePath = 'assets/';
const tempAtlassesPath = `${basePath}__temp_atlasses__`;
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

gulp.task('assets:pack-atlases', () => {
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
        .pipe(gulp.dest(tempAtlassesPath));
});

gulp.task('clear', () => {
    return del([tempAtlassesPath]);
});

gulp.task('assets', (done) =>
    gulp.series(init, 'clear', 'assets:pack-atlases', 'assets:images', 'assets:fonts', write)(done)
);
