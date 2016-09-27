// 评论回复动态添加DOM
$( function() {
  $('.replyBtn').click( function(e) {

    // 注意如果触发目标是一个链接
    // 那么这里就无法触发焦点事件
    // 需要禁止A元素的默认事件
    $('.commentText').focus();

    var target = $(this);
    var toId = target.data('tid');
    var commentId = target.data('cid');

    if( $('#toId').length > 0 ) {
      $('#toId').val(toId);
    }else{
      $('<input>').attr({
        type: 'hidden',
        name: 'comment[tid]',
        id: 'toId',
        value: toId
      }).appendTo('#commentForm');
    }
    
    if( $('#commentId').length > 0 ) {
      $('#commentId').val(commentId);
    }else{
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm');

    }

  });

});