define([], function() {
    return {
        init: function() {
            //1.表单验证。
            let $form = $('#form1'); //form表单。
            let $username = $('[name=username]'); //用户名。jq中name值也能取到元素  
            let $tel = $('[name=tel]'); //手机号码
            let $password = $('[name=password]'); //密码
            let $span = $('#form1 span'); //4个span
            console.log($form);
            // 定义检测标记
            $userflag = true;
            $passflag = true;
            $emailflag = true;
            $telflag = true;

            //用户名检测
            $username.on('focus', function() {
                $span.eq(0).html('中英文均可，最长14个英文或7个汉字').css('color', '#333');
            });

            $username.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $strLen = $value.replace(/[\u4e00-\u9fa5]/g, '**').length; //中文当做两个字符
                    if ($strLen > 0 && $strLen <= 14) {
                        let $reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                        if ($reg.test($value)) {
                            $span.eq(0).html('√').css({
                                "display": "block",
                                "width": "270px",
                                "padding-left": "30px",
                                "height": "30px",
                                "line-height": "30px",
                                "margin": "0 auto",
                                "color": "green"
                            });
                            $userflag = true;

                            //用户名格式没有问题，将用户名传给后端。
                            $.ajax({
                                type: 'post', //传递的方式
                                url: 'http://10.31.161.100/dashboard/kaola/php/reg.php',
                                data: {
                                    username: $username.val()
                                }
                            }).done(function(data) {
                                if (!data) { //不存在
                                    $span.eq(0).html('√').css({
                                        "display": "block",
                                        "width": "270px",
                                        "padding-left": "30px",
                                        "height": "30px",
                                        "line-height": "30px",
                                        "margin": "0 auto",
                                        "color": "green"
                                    });
                                } else { //存在
                                    $span.eq(0).html('该用户名已存在').css({
                                        "display": "block",
                                        "width": "270px",
                                        "padding-left": "30px",
                                        "height": "30px",
                                        "line-height": "30px",
                                        "margin": "0 auto",
                                        "color": "red"
                                    });
                                }
                            });


                        } else {
                            $span.eq(0).html('用户名格式有误').css({
                                "display": "block",
                                "width": "270px",
                                "padding-left": "30px",
                                "height": "30px",
                                "line-height": "30px",
                                "margin": "0 auto",
                                "color": "red"
                            });
                            $userflag = false;
                        }
                    } else {
                        $span.eq(0).html('用户名长度有误').css('color', 'red');
                        $userflag = false;
                    }
                } else {
                    $span.eq(0).html('用户名不能为空').css('color', 'red');
                }
            });

            //手机
            $tel.on('focus', function() {
                $span.eq(1).html('请输入11位正确的手机号码').css('color', '#333');
            });

            $tel.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $reg = /^1[3|5|8]\d{9}$/;
                    if ($reg.test($value)) {
                        $span.eq(1).html('√').css('color', 'green');
                        $telflag = true;
                    } else {
                        $span.eq(1).html('手机号码格式有误').css('color', 'red');
                        $telflag = false;
                    }
                } else {
                    $span.eq(1).html('手机号码不能为空').css('color', 'red');
                    $telflag = false;
                }
            });


            //阻止表单的直接跳转。
            $form.on('submit', function() {
                if ($username.val() === '') {
                    $span.eq(0).html('用户名不能为空').css('color', 'red');
                    $userflag = false;
                }
                if ($tel.val() === '') {
                    $span.eq(1).html('手机号码不能为空').css('color', 'red');
                    $telflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(2).html('密码不能为空').css('color', 'red');
                    $passflag = false;
                }
                if ($email.val() === '') {
                    $span.eq(3).html('邮箱不能为空').css('color', 'red');
                    $emailflag = false;
                }

                if (!$userflag || !$telflag || !$passflag || !$emailflag) {
                    return false;
                }
            });



        }
    }
});