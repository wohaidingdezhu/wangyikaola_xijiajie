define([], () => {
    return {
        init: function() {
            //代码实现
            //1.鼠标移入左侧的li元素，显示右侧的大盒子。
            const $list = $('.menu li');
            const $cartlist = $('.cartlist');
            const $items = $('.item');
            $list.hover(function() {
                $cartlist.show();
                $(this).addClass('active').siblings('li').removeClass('active');
                //切换内容发生改变，不同的li对应不同的内容块。
                $items.eq($(this).index()).show().siblings('.item').hide();
                //改变右侧的大盒子的位置
                let $scrolltop = $(window).scrollTop();
                let $bannertop = $('.banner').offset().top;
                if ($scrolltop > $bannertop) {
                    $cartlist.css({
                        top: $scrolltop - $bannertop
                    });
                } else {
                    $cartlist.css({
                        top: 0
                    });
                }
            }, function() {
                $cartlist.hide();
            });
            //2.鼠标移入右侧的大盒子，大盒子依然显示隐藏
            $cartlist.hover(function() {
                $(this).show();
            }, function() {
                $(this).hide();
            });
            //3.商城顶部悬浮
            const $box = $('.nav');
            let timer = null;
            $(window).on('scroll', () => {
                // console.log(this);
                clearInterval(timer);
                let $scrolltop = $(window).scrollTop(); //获取滚动条top值
                timer = setInterval(function() {
                    if ($scrolltop >= 260) {
                        $box.stop(true).animate({
                            top: 0 //改变box的top值参数 就是定位的那个参数
                        })
                    } else {
                        $box.stop(true).animate({
                            top: -60
                        })
                    }
                }, 300);

            });
            //检测是否用户已经登录
            if (localStorage.getItem('loginname')) {
                $('.admin').show();
                $('.login').hide();
                $('.admin span').html(localStorage.getItem('loginname'));
            }
            //退出登录 - 删除本地存储
            $('.admin a').on('click', function() {
                $('.admin').hide();
                $('.login').show();
                localStorage.removeItem('loginname');
            });
        }
    }
});