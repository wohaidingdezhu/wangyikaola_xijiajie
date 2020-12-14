define(['jlazyload'], () => {
    return {
        init: function() {
            //代码实现
            //1.鼠标移入左侧的li元素，显示右侧的大盒子。
            const $list = $('.menu li');
            const $cartlist = $('.cartlist');
            const $items = $('.item');
            $list.hover(function() {
                $cartlist.show();
                $(this).siblings('li').removeClass('selected');
                $(this).addClass('selected');
                $(this).addClass('active').siblings('li').removeClass('active');
                //切换内容发生改变，不同的li对应不同的内容块。
                $items.eq($(this).index()).show().siblings('.item').hide();
            });
            //2.鼠标移入右侧的大盒子，大盒子依然显示隐藏
            $cartlist.hover(function() {
                $(this).show();
            }, function() {
                $(this).hide();
            });

            //渲染数据第一块运动户外
            const $list2 = $('.list1234');
            $.ajax({
                url: 'http://localhost/dashboard/kaola/php/index.php',
                dataType: 'json'
            }).done(function(data) { //一个页面对应所有的数据接口
                let $strhtml = '';
                $.each(data, function(index, value) {
                    if (index < 4) {
                        $strhtml += `
                        <li class="s1-li">
                                <h3 class="tit1">${value.title}</h3>
                                <p class="s1-into">${value.intro}</p>
                                <img class="img-lazyload u-loaded" src="${value.url}">
                        </li>
                    `;
                    }
                });
                $list2.html($strhtml);
                $(function() { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //显示方法：淡入
                    });
                });
            });

            // //渲染数据第二块美妆专区
            const $list3 = $('.list5678');
            $.ajax({
                url: 'http://localhost/dashboard/kaola/php/index.php',
                dataType: 'json'
            }).done(function(data) { //一个页面对应所有的数据接口
                let $strhtml = '';
                $.each(data, function(index, value) {
                    if (index >= 4 && index <= 24) {
                        //因为之前删掉了数据sid。这里的4-24其实就是sid21-24
                        $strhtml += `
                        <li class="s1-li">
                            <h3 class="tit1">${value.title}</h3>
                            <p class="s1-into">${value.intro}</p>
                            <img class="img-lazyload u-loaded" src="${value.url}">
                        </li>
                        `;
                    }
                });
                $list3.html($strhtml);
                $(function() { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //显示方法：淡入
                    });
                });
            });

            //轮播
            const $lunbo = $('.content'); //全部包起来的
            const $ulist = $('.content ul'); //运动的盒子
            const $picList = $('.content ul li'); //3个图片
            const $btnList = $('.content ol li'); //3个圈圈
            const $left = $('#left');
            const $right = $('#right');
            let timer = null;
            let $num = 0; //存储索引值   
            //鼠标移入小圆圈的函数
            function lunbo() {
                $picList.css({ "display": "none" });
                // $(this).index():当前移入小点的索引
                // 将移入小点的对应的图片显示出来,并且将对应的小点的样式改掉
                $btnList.eq($num).addClass('stay').siblings().removeClass('stay');
                $picList.eq($num).css({ "display": "block" });
            }
            // 移入对应的小点，显示对应的图片
            $btnList.on('mouseover', function() {
                console.log($(this).index());
                // 在找之前将所有的图片隐藏
                // $picList.css({
                //     "display": "none"
                // });
                // // $(this).index():当前移入小点的索引就是图片的索引
                // // 将移入小点的对应的图片显示出来,并且将对应的小点的样式改掉
                // $btnList.eq($(this).index()).addClass('active').siblings().removeClass('active');
                // $picList.eq($(this).index()).css({
                //     "display": "block"
                // });


                // 将当前索引给$num
                $num = $(this).index();
                lunbo();
            });

            // 将向右轮播封装
            function rightfun() {
                $num++;
                if ($num > $btnList.length - 1) {
                    $num = 0;
                }
                lunbo();
            }

            // 点击右箭头，图片向右轮播
            $right.on('click', function() {
                // $num++;
                // if ($num > $btnList.length - 1) {
                //     $num = 0;
                // }
                // $picList.css({
                //     "display": "none"
                // });
                // $btnList.eq($num).addClass('active').siblings().removeClass('active');
                // $picList.eq($num).css({
                //     "display": "block"
                // });
                // lunbo();
                rightfun();
            });

            // 点击左箭头，图片向左轮播
            $left.on('click', function() {
                $num--;
                if ($num < 0) {
                    $num = $btnList.length - 1;
                }
                // $picList.css({
                //     "display": "none"
                // });
                // $btnList.eq($num).addClass('active').siblings().removeClass('active');
                // $picList.eq($num).css({
                //     "display": "block"
                // });
                lunbo();
            });

            // 定时器
            $timer = setInterval(function() {
                rightfun();
            }, 3000);

            // 移入最大的盒子，停止定时器
            $lunbo.on('mouseover', function() {
                clearInterval($timer);
            })

            // 移出盒子，开启定时器
            $lunbo.on('mouseout', function() {
                $timer = setInterval(function() {
                    rightfun();
                }, 3000);
            })

            //商城顶部悬浮
            const $topxuanfu = $('.searchflex');
            $(window).on('scroll', () => {
                let $scrolltop = $(window).scrollTop(); //获取滚动条top值
                if ($scrolltop >= 40) {
                    // clearInterval(timer);
                    console.log($scrolltop);
                    $topxuanfu.css({
                        // top: 0 //改变topxuanfu的top值参数 就是定位的那个参数
                        "position": "fixed",
                        "top": 0,
                        "display": "block"
                    })
                } else {
                    $topxuanfu.css({
                        // top: -60
                        "display": "none"
                    })
                }
            });


            // 侧边栏悬浮

            const $aside = $('.loutinav');
            $(window).on('scroll', () => {
                let $scrolltop = $(window).scrollTop(); //获取滚动条top值
                if ($scrolltop >= 636) {
                    // console.log($scrolltop);
                    $aside.css({
                        "position": "fixed",
                        "top": "66px",
                        "left": "50%",
                        "margin-left": "-665px"
                    })
                } else {
                    $aside.css({
                        "position": "absolute",
                        "top": 0,
                        "left": "-120px",
                        "margin-left": 0
                    })
                }
            });
        }
    }
});