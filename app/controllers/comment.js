var Comments = require('../models/comment');

// Comment.save
exports.save = function(req, res) {
     
  var _comment = req.body.comment;
  var movieId = _comment.movie;
  var comment = new Comments(_comment);

  comment.save(function(err,comment){
    if(err){
      console.log(err);
    }
    res.redirect('/movie/'+movieId);
  });

};
