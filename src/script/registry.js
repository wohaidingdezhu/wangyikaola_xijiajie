! function($) {
    const $username = $('#username');
    const $span = $('.yonghumings');

    $username.on('blur', function() {
        $.ajax({
            type: 'post',
            url: 'http://10.31.161.100/dashboard/kaola/php/reg.php',
            data: {
                xingming: $username.val()
            }
        }).done(function(data) { //data就是后端返回的结果
            if (!data) { //不存在
                $span.css('color', 'green').html('√');
            } else { //存在
                $span.css('color', 'red').html('该用户名已存在');
            }
        });
    });

}(jQuery);