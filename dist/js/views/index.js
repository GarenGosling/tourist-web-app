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

    var orgDetail = new OrgPop({
        $el: '#tpl-pop-sign-wrap',
        events: {
            toggleCheck: function($this) {
                $this.toggleClass('active');
                $this.parent().siblings().find('[bindClick="toggleCheck"]').toggleClass('active');
            }
        }
    })

})