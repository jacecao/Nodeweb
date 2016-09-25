$('.signsub').on('click', function() {
  
  $.post('/user/signup', $('#signup').serialize(), function(data) {
    alert(data.info);
  });

});

$('.loginsub').on('click', function() {
  
  $.post('/user/login', $('#login').serialize());

});