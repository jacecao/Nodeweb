var mongoose = require('mongoose');

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
//Schema.pre/post/..('init/validate/save/remove',callback)
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
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb){
    return this
      .findOne({_id: id})
      .exec(cb);
  }
};

module.exports = MovieSchema;