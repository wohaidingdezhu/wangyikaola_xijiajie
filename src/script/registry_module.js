define([], function() {
    return {
        init: function() {
            //1.表单验证。
            let $form = $('#form1'); //form表单。
            let $username = $('[name=username]'); //用户名。jq中name值也能取到元素  
            let $tel = $('[name=tel]'); //手机号码
            let $password = $('[name=password]'); //密码
            let $span = $('#form1 span'); //4个span
            // 定义检测标记
            $userflag = true;
            $passflag = true;
            $telflag = true;

            //用户名检测
            $username.on('focus', function() {
                $span.eq(0).html('中英文均可，最长14个英文或7个汉字').css({
                    "display": "block",
                    "width": "270px",
                    "padding-left": "30px",
                    "height": "30px",
                    "line-height": "30px",
                    "margin": "0 auto",
                    "color": "#333"
                });
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
                        $span.eq(0).html('用户名长度有误').css({
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
                    $span.eq(0).html('用户名不能为空').css({
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

            //手机
            $tel.on('focus', function() {
                $span.eq(1).html('请输入11位正确的手机号码').css({
                    "display": "block",
                    "width": "270px",
                    "padding-left": "30px",
                    "height": "30px",
                    "line-height": "30px",
                    "margin": "0 auto",
                    "color": "#333"
                });
            });

            $tel.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    let $reg = /^1[3|5|8]\d{9}$/;
                    if ($reg.test($value)) {
                        $span.eq(1).html('√').css({
                            "display": "block",
                            "width": "270px",
                            "padding-left": "30px",
                            "height": "30px",
                            "line-height": "30px",
                            "margin": "0 auto",
                            "color": "green"
                        });
                        $telflag = true;
                    } else {
                        $span.eq(1).html('手机号码格式有误').css({
                            "display": "block",
                            "width": "270px",
                            "padding-left": "30px",
                            "height": "30px",
                            "line-height": "30px",
                            "margin": "0 auto",
                            "color": "red"
                        });
                        $telflag = false;
                    }
                } else {
                    $span.eq(1).html('手机号码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $telflag = false;
                }
            });


            //密码
            $password.on('focus', function() {
                $span.eq(2).html('请输入密码,长度为8-14个字符').css({
                    "display": "block",
                    "width": "270px",
                    "padding-left": "30px",
                    "height": "30px",
                    "line-height": "30px",
                    "margin": "0 auto",
                    "color": "#333"
                });
            });
            //检测弱中强
            $password.on('input', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value.length >= 8 && $value.length <= 14) { //满足长度
                    let regnum = /\d+/; //一个有数字     
                    let reguppercase = /[A-Z]+/; //找存在就行
                    let reglowercase = /[a-z]+/;
                    let other = /[\W_]+/; //特殊字符%&^$#@!*
                    let count = 0; //字符种类的统计结果。
                    if (regnum.test($value)) { //值存在数字
                        count++;
                    }
                    if (reguppercase.test($value)) {
                        count++;
                    }
                    if (reglowercase.test($value)) {
                        count++;
                    }
                    if (other.test($value)) {
                        count++;
                    }
                    //根据统计的种类输出弱中强
                    switch (count) {
                        case 1:
                            $span.eq(2).html('弱').css({
                                "display": "block",
                                "width": "270px",
                                "padding-left": "30px",
                                "height": "30px",
                                "line-height": "30px",
                                "margin": "0 auto",
                                "color": "red"
                            })
                            $passflag = false;
                            break;
                        case 2:
                        case 3:
                            $span.eq(2).html('中').css({
                                "display": "block",
                                "width": "270px",
                                "padding-left": "30px",
                                "height": "30px",
                                "line-height": "30px",
                                "margin": "0 auto",
                                "color": "orange"
                            })
                            $passflag = true;
                            break;
                        case 4:
                            $span.eq(2).html('强').css({
                                "display": "block",
                                "width": "270px",
                                "padding-left": "30px",
                                "height": "30px",
                                "line-height": "30px",
                                "margin": "0 auto",
                                "color": "green"
                            })
                            $passflag = true;
                            break;
                    }

                } else {
                    $span.eq(2).html('密码长度有误').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    })
                    $passflag = false;
                }
            });

            $password.on('blur', function() {
                let $value = $(this).val(); //当前表单的值
                if ($value !== '') {
                    if ($passflag) {
                        $span.eq(2).html('√').css({
                            "display": "block",
                            "width": "270px",
                            "padding-left": "30px",
                            "height": "30px",
                            "line-height": "30px",
                            "margin": "0 auto",
                            "color": "#333"
                        });
                    }
                } else {
                    $span.eq(2).html('密码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $passflag = false;
                };
            });

            //阻止表单的直接跳转。
            $form.on('submit', function() {
                if ($username.val() === '') {
                    $span.eq(0).html('用户名不能为空').css({
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
                if ($tel.val() === '') {
                    $span.eq(1).html('手机号码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $telflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(2).html('密码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $passflag = false;
                }
                if (!$userflag || !$telflag || !$passflag) {
                    return false;
                }
            });

            //阻止表单的直接跳转。
            $form.on('submit', function() {
                if ($username.val() === '') {
                    $span.eq(0).html('用户名不能为空').css({
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
                if ($tel.val() === '') {
                    $span.eq(1).html('手机号码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $telflag = false;
                }
                if ($password.val() === '') {
                    $span.eq(2).html('密码不能为空').css({
                        "display": "block",
                        "width": "270px",
                        "padding-left": "30px",
                        "height": "30px",
                        "line-height": "30px",
                        "margin": "0 auto",
                        "color": "red"
                    });
                    $passflag = false;
                }
                if (!$userflag || !$telflag || !$passflag) {
                    return false;
                }
            });
        }
    }
});