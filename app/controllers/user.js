var Users = require('../models/user');

// 用户注册
exports.signup = function(req, res) {

    var user = req.body.user;
    // 注意在回调函数中返回参数一定不要与其他变量相同
    // 否则会出错
    // 比如下面的users变成user时就不会出现Bug
    // 当没有找到user时程序会自动找本作用域的相同变量
    Users.findOne({name: user.name}, function(err, users) {
      if( err ) { console.log(err); }

      if( users ) {
        res.json({
          info: '用户已经存在啦',
          state: 0
        });
      }else{
        var _user = new Users(user);
        _user.save(function(err, users) {
          if(err){
            console.log(err);
          }else{
            res.json({
              info: '用户注册成功',
              state: 1
            });
          }
        });
      }

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
      res.json({
        info: '没有该用户',
        state: 0
      });
    }
    else {

      user.comparePassword(password, function(err, isMatch) {
        
        if(err) { console.log(err); }

        if(isMatch) {
         req.session.user = user;
         return res.redirect('/');
        }
        else {
          res.json({
            info: '密码有错误',
            state: 0
          });
        }
      });
      
    }
  });

};

// 用户退出
exports.logout = function(req, res) {
  delete req.session.user;
  //delete app.locals.user;
  res.redirect('/');
};