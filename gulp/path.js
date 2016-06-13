// html,js,css默认路径
const app = './app'
const dist = './dist'
const tmp = './.tmp'
const allPath = app + '/*'

const htmlPath = {
  src: app + "/**/*.html",
  output: dist
}

const cssPath = {
  src: app + '/styles/**/*.css',
  scss: app + '/styles/**/*.scss',
  tmp: tmp + '/styles',
  output: dist + '/styles'
}

const jsPath = {
  src: app + '/js/**/*.js',
  tmp: tmp + '/js',
  output: dist + '/js'
}

const assetsPath = {
  src: app + '/assets/**/*',
  output: dist + '/assets'
}

export { htmlPath, cssPath, jsPath, assetsPath }
