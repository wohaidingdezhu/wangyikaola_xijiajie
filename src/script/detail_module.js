define(['jcookie'], () => {
    return {
        init: function() {
            let $sid = location.search.substring(1).split('=')[1]; //得到side 4
            if (!$sid) { //没有值 输出乱七八糟的东西 不存在为假
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
                console.log(data);
                console.log(data.urls);
                //获取数据，将数据放入对应的结构中。
                $('#smallpic').attr('src', data.url);
                $('.loadtitle').html(data.title);
                $('.loadpcp').html(data.price);

                //渲染放大镜下面的小图
                let $picurl = data.urls.split(','); //将数据转换成数组。
                let $strhtml = '';
                const $list = $('#list');
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
            //五.购物车：(商品sid、商品数量)
            //1.设置存储cookie的变量。
            let arrsid = []; //存储商品的sid
            let arrnum = []; //存储商品的数量
            //2.判断是第一次存储，多次存储。
            //获取cookie才能判断，每存储一个商品对应的cookie就会发生变化。
            //提前预判cookie设置时的key值(cookiesid/cookienum)
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                }
            }
            //上面的函数获取cookie值，并且转换成数组，方便判断是否是第一次。
            //第一次存储添加sid进入arrsid，存储数量
            //第二次以上，直接修改数量。
            $('.p-btn a').on('click', function() {
                getcookietoarray(); //获取cookie，变成数组，判断是否存在。
                if ($.inArray($sid, arrsid) === -1) { //不存在
                    arrsid.push($sid);
                    $.cookie('cookiesid', arrsid, 10);
                    arrnum.push($('#count').val());
                    $.cookie('cookienum', arrnum, 10);
                } else { //存着
                    //通过$sid获取商品的数量所在的位置。
                    let $index = $.inArray($sid, arrsid);
                    // arrnum[$index]//原来的数组
                    // $('#count').val()//新添加的数量
                    arrnum[$index] = parseInt(arrnum[$index]) + parseInt($('#count').val()); //重新赋值
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                }
                alert('按钮被点击了');
            });
        }
    }
});