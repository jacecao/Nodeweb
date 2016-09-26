var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// 创建评论数据模型，
// 这里需要参考mongoose文档种的population
// 这里通过population来创建数据关联
var CommentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie'
  },
  from: {
    type: ObjectId,
    ref: 'User'
  },
  // 创建回复数据模式
  replay: [
    {
      from:
    },
  ],
  to: {
    type: ObjectId,
    ref: 'User'
  },
  content: String,
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
//Schema.[pre/post/..(这里指数据状态)].('init/validate/save/remove',callback)
CommentSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});

//给数据模型绑定静态方法
CommentSchema.statics = {
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

module.exports = CommentSchema;