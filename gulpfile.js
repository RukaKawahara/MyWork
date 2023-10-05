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
const mkdirp = require('mkdirp'); 

/**
 * Sassをコンパイルするタスクです
 */
const compileSass = () => {
    // 出力先のディレクトリを作成
    mkdirp.sync('dist/assets/css');

    // style.scssファイルを取得
    return src("src/scss/*.scss")
        // コンパイル後のCSSを展開
        .pipe(sass({outputStyle: "expanded"}))
        // distフォルダー以下に保存
        .pipe(dest("./dist/assets/css/"))
        .pipe(browsersync.stream()); 
}

/**
 * Sassファイルを監視し、変更があったらSassを変換します
 */
const watchSassFiles = () => watch("./src/scss/**/*.scss", compileSass);

// pugをコンパイルする
const compilePug = () => {
    return src("src/pug/*.pug")
        .pipe(pug({pretty: true}))
        .pipe(dest("./dist/"))
        .pipe(browsersync.stream())
};

// pugファイルを監視
const watchPugFiles = () => watch("./src/pug/**/*.pug", compilePug);

// 画像ファイルを圧縮してコピー
const copyImages = () => {
    // 出力先のディレクトリを作成
    mkdirp.sync('dist/assets/images');

    return src('src/images/*')
        .pipe(imagemin())
        .pipe(dest("./dist/assets/images/"))
        .pipe(browsersync.stream()); 
}

// localサーバーを立ち上げる
const startServer = () =>
    browsersync.init({
        server:{
            baseDir: "./dist",
        }
    })

exports.default = series(
    parallel(compilePug, compileSass, copyImages),
    parallel(watchSassFiles, watchPugFiles, startServer),
);