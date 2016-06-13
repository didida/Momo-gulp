import $ from 'jquery'

$(function () {

  let app = $('.app')

  app.html("<ul class='home-list'><li><img src='./assets/img/logo.jpg' /></li><li><h2>Momo's Gulp</h2></li><li><p>使用了babel+browserify来使用es6新语法</p> <p>使用postcss的一些插件来使用新一代css语法和预处理器功能</p></li></ul>")

})
