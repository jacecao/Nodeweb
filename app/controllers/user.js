var Users = require('../models/user');

// 用户注册
exports.signup = function(req, res) {

    var user = req.body.user;
    // 注意在回调函数中返回参数一定不要与其他变量相同
    // 否则会出错
    // 比如下面的users变成user时就不会出现Bug
    // 当没有找到user时程序会自动找本作用域的相同变量
    Users.findOne({name: user.name}, function(err, auser) {
      if( err ) { console.log(err); }

      if( auser ) {
        res.redirect('/login');
      }else{
        var _user = new Users(user);
        _user.save(function(err, auser) {
          if(err){
            console.log(err);
          }else{
            req.session.user = auser;
            res.redirect('/');
          }
        });
      }

    });
};
exports.showSign = function(req, res) {
  res.render('signup', {
    title: '用户注册'
  });
};
// 用户登陆
exports.login = function(req, res) {
  
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  Users.findOne({name: name}, function(err, user) {
    if(err) { console.log(err); }
    if( !user ) {
      res.redirect('/signup');
    }
    else {

      user.comparePassword(password, function(err, isMatch) {
        
        if(err) { console.log(err); }

        if(isMatch) {
         req.session.user = user;
         return res.redirect('/');
        }
        else {
          res.redirect('/login');
        }
      });
      
    }
  });

};
exports.showLogin = function(req, res) {
  res.render('login', {
    title: '用户登录'
  });
};
// 用户退出
exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/');
};

// 用户列表
exports.userslist = function(req, res) {
  Users.fetch(function(err,users){
      if(err){
        console.log(err);
      }
      res.render('userslist',{
        title : '用户列表',
        users: users,
      });
  });
};

// 用户权限中间件设置
exports.userRequired = function(req, res, next) {
  var user = req.session.user;
  //console.log("*****111***"+user);
  if( !user ) {
    res.redirect('/signup');
  }
  next();
};
exports.superUser = function(req, res, next) {
  var user = req.session.user;
  //console.log("****222****"+user);
  if( user.role < 10 ) {
    res.redirect('/');
  }
  next();
};