(function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                throw new TypeError(
                    'Function.prototype.bind - what is trying to be bound is not callable'
                );
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(
                        this instanceof fNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                    );
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }

    if (!window.console) {
        window.console = {
            log: function() {},
            group: function() {},
            groupEnd: function() {}
        };
    }

    window.Org = function(config) {
        return new _Org(config);
    };

    window.OrgPop = function(config) {
        var _OrgPop = function(config) {};
        _OrgPop.prototype = new _Org(config);
        _OrgPop.prototype.show = function(data) {
            if(this.beforeRender) this.beforeRender(data);
            this.$render();
            this.$el.show();
            if(this.beforeFix) this.beforeFix(data);
            this.fixPopSize();
            if(this.afterShow) this.afterShow(data);
        };
        _OrgPop.prototype.hide = function() {
            if(this.beforeHide) this.beforeHide();
            this.$el.hide();
        };
        _OrgPop.prototype.fixPopSize = function() {
            var $el = this.$el;
            $el.css({
                top: '50%',
                left: '50%',
                marginTop: '-' + $el.height() / 2 + 'px',
                marginLeft: '-' + $el.width() / 2 + 'px'
            });
        };
        return new _OrgPop(config);
    };

    window.OrgPager = function(config) {
        var orgPager = new Org({
            $el: config.$el,
            $renderEl: config.$renderEl,
            $tpl: config.$tpl,
            data: {
                currentPage: 0,
                totalPage: 0,
                totalRecords: 0,
                list: []
            },
            events: {
                jump: function($this, event) {
                    var dir = $this.data('d');
                    var page = $this.data('p')*1;
                    if (dir == 1) {
                        page = this.data.currentPage - 3;
                    } else if (dir == 2) {
                        page = this.data.currentPage + 3;
                    } else {
                        
                    }
                    this.jumpTo(page);
                },
                prev: function() {
                    this.jumpTo(this.data.currentPage-1);
                },
                next: function() {
                    this.jumpTo(this.data.currentPage+1);
                }
            },
            pager: function(data) {
                $.extend(this.data, data);
                this.createList();
                this.$render();
                this.markCurrent();
            },
            createList: function() {
                var currentPage = this.data.currentPage;
                var totalPage = this.data.totalPage;
                var list = [];
                if (totalPage <= 8 && totalPage > 0) {
                    for(var i=1; i<=totalPage; i++) {
                        list.push({p:i});
                    }
                }
                if (totalPage > 8) {
                    if (currentPage + 6 > totalPage) {
                        list.push({p:'...'});
                        for(var j=6; j>=0; j--) {
                            list.push({p:totalPage-j});
                        }
                    } else {
                        if (currentPage > 3) {
                            list.push({p:'...',d:1});
                        }
                        for(var k=0; k<3; k++) {
                            list.push({p:currentPage+k});
                        }
                        list.push({p:'...',d:2});
                        for(var l=2; l>=0; l--) {
                            list.push({p:totalPage-l});
                        }
                    }
                }
                this.data.list = list;
            },
            markCurrent: function() {
                var currentPage = this.data.currentPage;
                this.$renderEl
                    .find('li[data-p="' + currentPage + '"]')
                    .addClass('active');
            },
            jumpTo: function(page) {
                var _page;
                if (page < 1) {
                    _page = 1;
                } else if (page > this.data.totalPage) {
                    _page = this.data.totalPage;
                } else {
                    _page = page;
                }
                config.cb(_page);
            }
        });
        return orgPager;
    };

    var _Org = function(config) {
        $.extend(this, { data: {}, events: {} }, config);
        this.$el = $(config.$el);
        if (config.$renderEl) this.$renderEl = $(config.$renderEl);
        if (config.$tpl) this.$tpl = $.templates(config.$tpl);

        // this.$init();

        // console.log('正在初始化...');
        if ($.isFunction(this.init)) this.init();
        this.$bindEvents();
    };

    _Org.prototype = {
        $render: function() {
            var html = '';
            if (!this.$tpl) return;
            if (this.$renderEl) {
                html = $(this.$tpl.render(this.data));
                this.$renderEl.html(html);
                return;
            }
            if (this.$el) {
                html = $(this.$tpl.render(this.data));
                this.$el.html(html);
                return;
            }
        },

        $bindEvents: function() {
            // console.log('事件绑定');
            var _this = this;

            $.each(_this.events, function(ename, cb) {
                _this.$el
                    .on('click', '[bindClick="' + ename + '"]', function(
                        event
                    ) {
                        cb.call(_this, $(this), event);
                    })
                    .on('change', '[bindChange="' + ename + '"]', function(
                        event
                    ) {
                        cb.call(_this, $(this), event);
                    })
                    .on('click', '[bindSelect="' + ename + '"] em', function(
                        event
                    ) {
                        $(this).siblings('ul').toggle();
                    })
                    .on('click', '[bindSelect="' + ename + '"] li', function(
                        event
                    ) {
                        $(this)
                            .parents('[bindSelect="' + ename + '"]')
                            .find('em')
                            .trigger('click');
                        cb.call(_this, $(this), event);
                    })
                    .on('keyup', '[bindKey="' + ename + '"]', function(event) {
                        cb.call(_this, $(this), event);
                    })
                    .on('keyup', '[bindKeyUp="' + ename + '"]', function(event) {
                        cb.call(_this, $(this), event);
                    })
                    .on('keydown', '[bindKeyDown="' + ename + '"]', function(event) {
                        cb.call(_this, $(this), event);
                    });
            });
        },

        checkAjaxStatus: function(res) {
            if (res.status == 401) {
                alert('请登录');
                return;
            }
            if (res.status != 200) {
                alert(res.message);
                return;
            }
            return true;
        }
    };
})();
