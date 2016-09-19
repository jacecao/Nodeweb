 var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie.js');

// 创建数据集Movie并得到数据模板Movie
// 注意这里有2个动作会自动触发，
// 1是真实创建数据集，2是获取数据样板(模板)
// 其实相当于在数据库中已经准备了一个以MovieSchema规定的以movies的数据集
// 后面使用new Movie来创建一个符合MovieSchema要求的真实数据
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie; 