define(['jcookie'], () => {
    return {
        init: function() {
            //登录后显示名字
            //检测是否用户已经登录
            if (localStorage.getItem('loginname')) {
                $('.admin').show();
                $('.top_left').hide();
                $('.admin span').html(localStorage.getItem('loginname'));
            }
            //退出登录 - 删除本地存储
            $('.admin a').on('click', function() {
                $('.admin').hide();
                $('.top_left').show();
                localStorage.removeItem('loginname');
            });

            //1.通过地址栏获取列表页面传入的sid。
            let $sid = location.search.substring(1).split('=')[1]; //得到side 4
            if (!$sid) { //没有值 输出乱七八糟的东西 不存在为假 列表页面没有传入sid，默认为1
                $sid = 1;
            }
            //2.将sid传给后端，后端根据对应的sid返回不同的数据。
            $.ajax({
                url: 'http://10.31.161.100/dashboard/kaola/php/detail.php',
                data: {
                    sid: $sid
                },
                dataType: 'json'
            }).done(function(data) { //后端php页面根据sid找到数据库对应那条数据
                // console.log(data);
                // console.log(data.urls);
                //获取数据，将数据放入对应的结构中。
                $('#smallpic').attr('src', data.url);
                $('.loadtitle').html(data.title);
                $('.loadpcp').html(data.price);
                $('#bpic').attr('src', data.url);
                //渲染放大镜下面的小图
                let $picurl = data.urls.split(','); //将数据转换成数组。
                let $strhtml = '';
                const $list = $('#list ul');
                console.log($picurl);
                $.each($picurl, function(index, value) {
                    $strhtml += `
                        <li>
                            <img src="${value}"/>
                        </li>
                    `;
                });
                $list.html($strhtml);
            });
            //放大镜效果
            const $spic = $('#spic');
            const $bpic = $('#bpic');
            const $sf = $('#sf'); //小放
            const $bf = $('#bf'); //大放
            const $left = $('#left'); //左箭头
            const $right = $('#right'); //右箭头
            const $list = $('#list'); //小图列表
            //$spic 小图   $bpic 大图  

            //小放/大放=小图/大图
            $sf.width($spic.width() * $bf.width() / $bpic.width());
            $sf.height($spic.height() * $bf.height() / $bpic.height());
            let $bili = $bpic.width() / $spic.width(); //比例大于1 放大效果
            $spic.hover(function() {
                $sf.css('visibility', 'visible');
                $bf.css('visibility', 'visible');
                $(this).on('mousemove', function(ev) {
                    let $leftvalue = ev.pageX - $('.goodsinfo').offset().left - $sf.width() / 2;
                    let $topvalue = ev.pageY - $('.goodsinfo').offset().top - $sf.height() / 2;
                    if ($leftvalue < 0) {
                        $leftvalue = 0;
                    } else if ($leftvalue >= $spic.width() - $sf.width()) {
                        $leftvalue = $spic.width() - $sf.width()
                    }

                    if ($topvalue < 0) {
                        $topvalue = 0;
                    } else if ($topvalue >= $spic.height() - $sf.height()) {
                        $topvalue = $spic.height() - $sf.height()
                    }

                    $sf.css({
                        left: $leftvalue,
                        top: $topvalue
                    });

                    $bpic.css({
                        left: -$leftvalue * $bili,
                        top: -$topvalue * $bili
                    });

                });
            }, function() {
                $sf.css('visibility', 'hidden');
                $bf.css('visibility', 'hidden');
            });
            //小图切换 - 小图是渲染出来的，找不到li。
            $list.on('click', 'li', function() { //事件委托,ul元素没有高度不可见，委托#list
                let imgurl = $(this).find('img').attr('src'); //获取当前图片的地址
                $('#smallpic').attr('src', imgurl);
                $('#bpic').attr('src', imgurl);
            });
            //左右箭头事件
            let $num = 6; //列表显示的图片个数,重要的信息
            $right.on('click', function() {
                console.log($(this));
                let $lists = $('#list ul li');
                if ($lists.size() > $num) { //限制点击的条件，如果$num值小于li的长度，继续点击右键头
                    $num++;
                    $left.css('color', '#333');
                    if ($lists.size() == $num) {
                        $right.css('color', '#fff');
                    }

                    //列表运动
                    $('#list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });
            $left.on('click', function() {
                let $lists = $('#list ul li');
                if ($num > 6) { //限制点击的条件
                    $num--;
                    $right.css('color', '#333');
                    if ($num <= 6) {
                        $left.css('color', '#fff');
                    }
                    $('#list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });

            //4.购物车：(商品sid、商品数量)
            //4.1设置存储cookie的变量,因为是多个商品，采用数组存储。
            let arrsid = []; //存储商品的sid
            let arrnum = []; //存储商品的数量

            //4.2核心是判断用户是第一次存储，多次存储。
            //如果是第一次存储，创建商品的列表显示在购物车列表页面。
            //如果是多次存储，购物车列表页面里面的商品数量累加。


            //如何判断是第一次还是第二次
            //通过获取cookie进行判断，每存储一个商品对应的商品编号存入cookie里面，cookie就会发生变化。如果cookie里面存在当前商品的编号，该商品不是第一次存储，直接数量累加。

            //提前预判cookie设置时的key值(cookiesid/cookienum)进行获取cookie
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                } else { //cookie不存在，清空数组。
                    arrsid = [];
                    arrnum = [];
                }
            }
            //上面的函数获取cookie值，并且转换成数组，方便判断是否是第一次。
            //第一次存储添加sid进入arrsid，存储数量
            //第二次以上，直接修改数量。

            $('.p-btn a').on('click', function() {
                getcookietoarray(); //获取cookie，变成数组，判断是否存在。
                if ($.inArray($sid, arrsid) === -1) { //第一次添加商品
                    arrsid.push($sid); //添加sid
                    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
                    arrnum.push($('#count').val()); //添加数量
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                } else { //多次添加，数量累加
                    //通过$sid获取商品的数量所在的位置。
                    let $index = $.inArray($sid, arrsid);
                    //原来的数量+新加的数量进行重新赋值，添加cookie
                    arrnum[$index] = parseInt(arrnum[$index]) + parseInt($('#count').val()); //重新赋值
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                }
                alert('按钮被点击了');
            });

        }
    }
});