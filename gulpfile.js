// 除了gulp
// 需要下载browser-sync和gulp-nodemon模块

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodeMon = require('gulp-nodemon');
var reload = browserSync.reload;

gulp.task('server', ['nodemon','app'], function() {
  
  browserSync.init({
    proxy:'http://localhost:3000',
    port: 4000,
  });

});

//
gulp.task('app', function(){

  gulp.watch('./app.js',['nodemon']).on('change', reload);
  gulp.watch('./views/**/*.jade').on('change', reload);
  
});

// 启动app.js
gulp.task('nodemon', function(cb ) {
  var started = false;

  return nodeMon({
    script: 'app.js',
    env: { 'NODE_ENV': 'development' }
  }).on('start', function() {
    if( !started ) {
      cb();
      started = true;
    }
  });

});