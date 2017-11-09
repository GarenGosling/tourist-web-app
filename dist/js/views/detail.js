$(function() {
	var id = location.search.split('=')[1];
    var orgList = new Org({
        $el: '#detail',
        init: function() {
            $('.detail_wrap_item.'+id).show();
        }
    });
})