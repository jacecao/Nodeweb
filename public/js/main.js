$( function () {
  $('#inputDouban').blur( function() {
    var _value = $(this).val();
    
    if (_value) {
      $.ajax({
        url: 'https://api.douban.com//v2/movie/subject/' + _value,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function (data) {
          $('#inputTitle').val(data.title);
          $('#inputDoctor').val(data.directors[0].name);
          $('#inputCountry').val(data.countries[0]);
          $('#inputYear').val(data.year);
          $('#inputPoster').val(data.images.large);
          $('#inputSummary').val(data.summary);
          var _category = data.genres[0];
          var have = false;
          $('#selectCategory option').each( function() {
            if ( $(this).html().indexOf(_category) >= 0 ) {
              $(this).attr('selected','selected');
              have = true;
            }
          });
          if ( !have ) {
            var _option = $('<option selected>');
            var _input = $('<input type="hidden" name="movie[category]">');
            _input.val(_category);
            _option.html(_category).val('');
            $('#selectCategory').append(_option).append(_input);
          }  
        }
      });
    }
   
  });
});