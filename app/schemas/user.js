var mongoose = require('mongoose');
// 载入加密模块 bcryptjs为开发模块配置
//var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcryptjs');

var SALT_WORK_FACTOR = 10;

// 创建数据模型，
var UserSchema = new mongoose.Schema({
  name: {
    // 设置需要检测该值的唯一性
    unique: true,
    trim: true,
    type: String
  },
  password: String,
  // 设置一个用户的权限属性
  // 大于10时为超级用户
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      // 这里是创建数据默认值，
      // 会根据你的设定来自动赋值
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

//定义中间件
UserSchema.pre('save',function(next){
  
  var user = this;

  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }

  //对密码加密
  
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });

  });
  
  /* //bcrypt-nodejs
  var hash = bcrypt.hashSync(user.password);
  user.password = hash;
  next();
  */

});

// 给数据模型声明实例方法
UserSchema.methods = {

  comparePassword: function(_password, cb) {

    var hash = this.password;
    bcrypt.compare(_password, hash, function(err, result) {

      if(err) {
        cb(err);
      }
      else {
        cb(null,result);
      }
     
    });
    
  },

};

//给数据模型绑定静态方法
UserSchema.statics = {
  fetch: function(cb){
    return this
      // 查询所有的数据
      .find({})
      // 这里是排序
      .sort('meta.updateAt')
      // 这里是指将执行的结果传入回调函数
      // 通常是返回数据状态和请求(储存)的数据
      .exec(cb);
  },
  findById: function(id, cb){
    return this
    // 查询指定ID数据,这里的_id是mongodb会自动生成
      .findOne({_id: id})
      .exec(cb);
  }
};

module.exports = UserSchema;