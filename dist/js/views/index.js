$(function() {
    var app = new Org({
        $el: '#index',
        events: {
            toggleLink: function($this, event) {
                var e = event || window.event;
                if(e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                $this.find('ol').slideToggle(150);
            },
            hideSelect: function() {
                $('[bindClick="toggleLink"]').find('ol').slideUp(150);
            }
        }
    })


})