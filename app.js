// express node应用搭建模块
var express = require('express');

// 加载表单序列化模块
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// 这里如果不用app.use(),就需要在post请求中加入该模块作为数据处理中间件
// app.post(请求路径，中间件，回调函数)
// var urlencoded = bodyParser.urlencoded({ extended: true });
// app.post('/admin/movie/new', urlencoded, function(req, res){});

// 加载mongoDB数据处理模块
var mongoose = require('mongoose');

// 开发环境测试模块？？？？
var morgan = require('morgan');

// 加载路径处理模块
// 该模块能规范的输出模块路径
// 这里主要是兼容多服务端的路径访问
// 没有此模块也能正常运行
var path = require('path');

// 端口设置
// process.env.PORT 这里是指Node环境中默认的端口
var port = process.env.PORT || 3000;

// 创建服务应用实例
var app = express();

// 连接数据库
// 这里需要安装Mongodb,并且要启动mongodb服务
var connection = mongoose.connect('mongodb://127.0.0.1:27017/imovie');

// 用户登陆状态记录组件
var cookieParse = require('cookie-parser');
var session = require('express-session');
var MonogoStore = require('connect-mongo')(session);

var multipart = require('connect-multiparty');


// 设置视图路径
app.set('views','./app/views/pages');
// 设置模板引擎为jade
app.set('view engine','jade');

// express4版本内置的静态资源读取express.static()
// 指定读取静态资源的路径为public文件夹
// 这里主要是加载bootstrap中的 css js）
// __dirname变量获取当前模块文件所在目录的完整绝对路径
// app.use()是干啥的呢？
// app.use 加载用于处理http請求的middleware（中间件），
// 当一个请求来的时候，会依次被这些 middlewares处理
app.use( express.static( path.join(__dirname, 'public') ) );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( multipart() );

app.use( cookieParse() );

app.use( session({
  secret: 'imovie',
  store: new MonogoStore({
    url: 'mongodb://127.0.0.1:27017/imovie',
    collection: 'sessions'
  }),
}));


// 加载时间处理模块
// app.locals对象字面量中定义的键值对，
// 是可以直接在模板中使用的，
// 就和res.render时开发者传入的模板渲染参数一样
// 这里是指可以在模板中使用moment方法
// 在list.jade中我们需要将数据中的时间转换成mm/dd/yyyy
// 那么就需要用到moment，所以这里是为了将该方法能传入到模板中
// 这里如果换成app.locals.dateFun = require('moment');
// 在list模板中我们就需要 #{dateFun(xxxxx).format(MM/DD/YYYY)}
app.locals.moment = require('moment');

// 配置开发环境，主要用于显示数据交互信息等
if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

// 载入路由文件
require('./route/route.js')(app);

// 404错误处理
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', {
    title: '404错误'
  });
  next(err); 

});

// 监听端口
app.listen(port);
console.log('imovie started on port:' +port);