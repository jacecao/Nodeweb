var mongoose = require('mongoose');

// 创建数据模型，
// 可以理解为每个数据中有什么字段，每个字段是什么类型的数据
var MovieSchema = new mongoose.Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
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
//这里是指在储存该数据前，我们需要做什么
//Schema.[pre/post/..(这里指数据状态)].('init/validate/save/remove',callback)
MovieSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});

//给数据模型绑定静态方法
MovieSchema.statics = {
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

module.exports = MovieSchema;