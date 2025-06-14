// webpackeの設定ファイル

let dist = './dist/js';   // 出力先ディレクトリ
let src = './src/js';     // ソースディレクトリ

module.exports = {

  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'production',

  // node_moduleの方は使用せず別定義でそちらを参照。詳しくはreadMeテキストに記載
  // module: {
  //   rules: [
  //     {
  //       // node_module内のcss
  //       test: /node_modules\/(.+)\.css$/,
  //       use: [
  //         {
  //           loader: 'style-loader',
  //         },
  //         {
  //           loader: 'css-loader',
  //           options: { url: false },
  //         },
  //       ],
  //     },
  //   ]
  // },

  // 出力先の指定
  dist: dist,

  // jsのビルド設定
  js: {
    src: src + '/js/**',
    dist: dist + '/module/',
    uglify: true
  },
  // webpackの設定
  webpack: {
    entry: src + '/lib_rs.js',
    output: {
      filename: 'build.js'
    },
    // webpack4から？警告が出るのでこちらもmodeを設定
    mode: 'production'
  }
}