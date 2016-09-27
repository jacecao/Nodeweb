var Comments = require('../models/comment');

// Comment.save
exports.save = function(req, res) {
     
  var _comment = req.body.comment;
  var movieId = _comment.movie;

  // 这里需要判断是否是对用户进行评论
  if(_comment.cid) {
    // 如果有这个值，那么根据该值我们获得该评论数据
    // 注意这里一定不要被各种id搞混淆了
    // findById()是我们在数据模块种定义的静态方法
    Comments.findById(_comment.cid ,function(err, comment) {

      console.log(comment);

      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };

      comment.reply.push(reply);
      comment.save(function(err,comment){
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movieId);
      });

    });
  
  }else {

    var comment = new Comments(_comment);
    comment.save(function(err,comment){
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movieId);
    });

  }

};


