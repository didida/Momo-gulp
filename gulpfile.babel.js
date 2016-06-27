/**
*
* gulp配置
* author momo
* date 2016-06-12 15:00
*/

"use strict"

import gulp from 'gulp'
import path from 'path'
import del from 'del'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import glob from 'glob'

// postcss插件
import salad from 'postcss-salad'

// 默认入口
import { htmlPath, cssPath, jsPath, assetsPath } from './gulp/path'

// 报错提示引入
import handleErrors from './gulp/util'

// 自动引入package的gulp插件
import gulpLoadPlugins from 'gulp-load-plugins'
const $ = gulpLoadPlugins()

// 引入browserSync
import browserSync from 'browser-sync'
const reload = browserSync.reload

// 清除之前的编译的文件
gulp.task('clean', () => del(['./dist/*', './dist', './.tmp']))

// 压缩html
gulp.task('html', () => {
  return gulp.src(htmlPath.src)
    // 合并html内的css和js，命令在html的注释里
    .pipe($.useref({
      searchPath: '{app, .tmp}',
      noAssets: true
    }))
    // 只压缩html
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true//删除<style>和<link>的type="text/css"
    })))
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest(htmlPath.output))
})

// 引入postcss，并且压缩
gulp.task('postcss', () => {

  const browserOptions = {
    browsers: [
    'last 3 versions',
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 12.1',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10',
    'and_uc 9.9',
    ]
  }

  return gulp.src([
    cssPath.src,
    cssPath.scss
  ])
    // .pipe($.watch('app/**/*.css'))
    .pipe($.newer('./tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.postcss([salad]))
    .on('error', handleErrors)
    // 清除没有被使用到的css
    .pipe($.if('*.css, *.scss', $.uncss({
      html:[
        'app/**/*.html'
      ]
    })))
    .pipe($.autoprefixer(browserOptions))
    .pipe($.concat('mian.css'))
    .pipe(gulp.dest('./.tmp/styles'))
    // 进行压缩
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'css'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(cssPath.output))
})

// 使用browserify和babel进行es6编译
gulp.task('js', () => {
  var filenames = glob.sync(jsPath.src);
  return browserify({
    entries: filenames,
    debug: true
  })
  .transform(babelify)
  .bundle()
  .on('error', handleErrors)
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe($.uglify({preserveComments: 'some'}))
  .pipe($.sourcemaps.init())
  .pipe($.sourcemaps.write("."))
  .pipe($.size({title: 'js'}))
  .pipe(gulp.dest(jsPath.output))
})

// 复制项目下的所有文件到dist
gulp.task('assets', () =>
  gulp.src([
    assetsPath.src,
    '!./app/*.html'
  ])
  .pipe(gulp.dest(assetsPath.output))
  .pipe($.size({title: 'assets'}))
)

// 搭建本地服务器和浏览器自动刷新
gulp.task('server', ['js', 'html', 'postcss', 'assets'], () => {
  browserSync({
    open: false,
    notify: false,
    server: ['dist'],
    port: 12306
  })

  gulp.watch([htmlPath.src], ['html', reload])
  gulp.watch([assetsPath.src], ['assets', reload])
  gulp.watch([cssPath.src], ['postcss', reload])
  gulp.watch([jsPath.src], ['js', reload])
  gulp.watch([assetsPath.src], ['assets', reload])
})

// 使用gulp
gulp.task('default', ['clean'], () => {
  gulp.start('postcss', 'html', 'assets', 'js', 'server')
})
