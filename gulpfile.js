// gulpプラグインを読み込みます
const { src, dest, watch, series, parallel} = require("gulp");
// Sassをコンパイルするプラグインを読み込みます
const sass = require('gulp-sass')(require('sass'));
// pugをコンパイルするプラグインを読み込みます
const pug = require("gulp-pug");
// gulp-connectをインストールし、localhostサーバーを起動できるようにします。
const browsersync = require("browser-sync");
// gulpを使って画像を圧縮する
const imagemin = require('gulp-imagemin');

/**
 * Sassをコンパイルするタスクです
 */
const compileSass = () =>
    // style.scssファイルを取得
    src("src/scss/*.scss")
        // コンパイル後のCSSを展開
        .pipe(sass({outputStyle: "expanded"}))
        // distフォルダー以下に保存
        .pipe(dest("dist"))
        .pipe(browsersync.stream()); 

/**
 * Sassファイルを監視し、変更があったらSassを変換します
 */
const watchSassFiles = () => watch("src/scss/*.scss", compileSass);

// pugをコンパイルする
const compilePug = () =>
    src("src/pug/*.pug")
        .pipe(pug({pretty: true}))
        .pipe(dest("dist"))
        .pipe(browsersync.stream()); 

// pugファイルを監視
const watchPugFiles = () => watch("src/pug/*.pug", compilePug);

// 画像ファイルを圧縮してコピー
const copyImages = () =>
    src('src/img/*')
        .pipe(imagemin())
        .pipe(dest("dist/img"))
        .pipe(browsersync.stream()); 

// localサーバーを立ち上げる
const startServer = () =>
    browsersync({
        server:{
            baseDir: "./dist",
        }
    })

exports.default = series(parallel(watchSassFiles, watchPugFiles, copyImages, startServer));