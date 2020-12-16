//分页的接口：http://10.31.161.32/JS2010/projectname/php/listdata.php
//前端获取总的页数：后端提供
//pagination.js分页的插件，支持AMD格式。
//列表页的思路
//第一步：渲染列表页的第一页，默认的数据。
//第二步：将分页页码传递给后端，后端返回对应页码的数据，重新渲染。上面的两步渲染过程是一样的，数据是有区别的。
//第三步：排序，获取对应的元素结构(li)里面的价格(数字),将li组成为一个数组,对数组里面的li元素进行排序
//第四步：采用冒泡排序，两两相互比较(价格),通过价格改变li的排序。
define(['pagination', 'jlazyload'], function() {
    return {
        init: function() {
            const $list = $('.list ul');
            let $array_default = []; //排序前的li放入此数组。
            let $array = []; //排序后的数组
            let $prev = []; //li里面的商品的前一个价格
            let $next = []; //li里面的商品的后一个价格
            //1.渲染列表页面
            $.ajax({
                url: 'http://10.31.161.100/dashboard/kaola/php/listdata.php',
                dataType: 'json'
            }).done(function(datalist) {
                console.log(datalist); //返回的是一个对象，因为加了page数据接口
                data = datalist.pagedata; //获取接口里面数据
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}">
                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                <p class="p">${value.title}</p>
                                <span class="sp">￥${value.price}</span>
                             </a>
                        </li>
                    `;
                });
                $list.html($strhtml);
                //懒加载
                $("img.lazy").lazyload({ effect: "fadeIn" });


                //将li元素添加到排序前的数组中。
                $array_default = [];
                $array = [];
                $('.list li').each(function(index, element) { //element:原生的元素对象
                    $array_default[index] = $(this); //排序前
                    //比如每页长度是15，数组里面有15项
                    //index:0-14
                    //如果数据不够15条，只有10条，替换前面的10条，后面还多余了5条
                    $array[index] = $(this); //排序后
                });
                console.log($array_default);


                //2.进行分页设置(html页面载入分页的结构)
                $('.page').pagination({
                    pageCount: datalist.pageno, //总的页数
                    jump: true, //是否开启跳转到指定的页数，布尔值。
                    prevContent: '上一页', //将图标改成上一页下一页。
                    nextContent: '下一页',
                    callback: function(api) {
                        console.log(api.getCurrent()); //获取当前的点击的页码。
                        $.ajax({
                            url: 'http://10.31.161.100/dashboard/kaola/php/listdata.php',
                            data: {
                                page: api.getCurrent() //传入点击的页码
                            },
                            dataType: 'json'
                        }).done(function(datalist) {
                            data = datalist.pagedata; //获取接口里面数据
                            let $strhtml = '';
                            $.each(data, function(index, value) {
                                $strhtml += `
                                        <li>
                                            <a href="detail.html?sid=${value.sid}">
                                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                                <p class="p">${value.title}</p>
                                                <span class="sp">￥${value.price}</span>
                                            </a>
                                        </li>
                                    `;
                            });
                            $list.html($strhtml);
                            //懒加载
                            $("img.lazy").lazyload({ effect: "fadeIn" });

                            //将li元素添加到排序前的数组中。
                            $('.list li').each(function(index, element) { //element:原生的元素对象
                                $array_default[index] = $(this); //排序前
                                $array[index] = $(this); //排序后
                            });
                            console.log($array_default);
                        });
                    }
                });
                //3.点击综合进行默认排序 
                $('button').eq(0).on('click', function() {
                    //遍历渲染。
                    $.each($array_default, function(index, value) { //value就是li元素
                        $list.append(value);
                    });
                });
                //同一个按钮按一次是升序，再按一次是降序，这就可以利用开关思维冒泡排序，两两比较i代表轮数，j代表次数。10个数字只要比较九轮i-1                
                var flag = true;
                $('button').eq(1).on('click', function() {
                    if (flag) {
                        //升序
                        for (let i = 0; i < $array.length - 1; i++) {
                            for (let j = 0; j < $array.length - i - 1; j++) {
                                $prev = parseFloat($array[j].find('span').html().substring(1)); //上一个价格 截取掉￥
                                $next = parseFloat($array[j + 1].find('span').html().substring(1)); //下一个价格
                                if ($prev > $next) {
                                    //通过价格的比较,交换的是里面的这个li元素
                                    let temp = $array[j];
                                    $array[j] = $array[j + 1];
                                    $array[j + 1] = temp;
                                }
                            }
                        }
                        //遍历渲染。
                        $.each($array, function(index, value) { //value就是li元素
                            $list.append(value);
                        });
                        //开关变成false 降序
                        flag = false;
                    } else {
                        for (let i = 0; i < $array.length - 1; i++) {
                            for (let j = 0; j < $array.length - i - 1; j++) {
                                $prev = parseFloat($array[j].find('span').html().substring(1)); //上一个价格
                                $next = parseFloat($array[j + 1].find('span').html().substring(1)); //下一个价格
                                if ($prev < $next) {
                                    //通过价格的比较,交换的是里面的这个li元素
                                    let temp = $array[j];
                                    $array[j] = $array[j + 1];
                                    $array[j + 1] = temp;
                                }
                            }
                        }
                        //遍历渲染。
                        $.each($array, function(index, value) { //value就是li元素
                            $list.append(value);
                        });
                        flag = true;
                    }
                });
            });

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

        }
    }
});