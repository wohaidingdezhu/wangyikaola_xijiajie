define(['jlazyload'], () => { //懒加载依赖与这个
    return {
        init: function() {
            const $list = $('.list ul');
            $.ajax({
                url: 'http://localhost/dashboard/JS2010/week06/Day%2029-Day%2031_jquery/projectname/php/listdata.php',
                dataType: 'json'
            }).done(function(data) { //一个页面对应所有的数据接口
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}">
                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                <p>${value.title}</p>
                                <span>￥${value.price}</span>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml);
                $(function() { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //显示方法：淡入
                    });
                });
            });
        }
    }
})