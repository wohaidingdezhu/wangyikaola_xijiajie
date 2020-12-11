! function($) {
    const $username = $('#username');
    const $span = $('span');

    $username.on('blur', function() {
        $.ajax({
            type: 'post',
            url: 'http://localhost/dashboard/JS2010/week06/Day%2029-Day%2031_jquery/projectname/php/reg.php',
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