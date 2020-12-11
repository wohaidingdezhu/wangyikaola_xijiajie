<?php
//1.连接数据库
include "conn.php";
//3.获取前端传入的用户名做唯一值的检测。
if(isset($_POST['xingming']) ){
    $name = $_POST['xingming'];
    $result=$conn->query("select * from registry where username='$name'");
    //如果存在结果，表示该用户名已经存在，否则不存在。
    if($result->fetch_assoc()){//存在 php里面的true返回1
        echo true;
    }else{//不存在,php里面的false返回空隙。
        echo false;
    }
}

//2.获取前端表单传入的值。
if(isset($_POST['submit'])){//前端点击了submit提交按钮，后端开始接收值。
    $user = $_POST['username'];
    $pass = sha1($_POST['password']);
    $email = $_POST['email'];
    $conn->query("insert registry values(null,'$user','$pass','$email',NOW())");//将数据传递给数据库。
    //一旦数据提交成功，回到前端的登录页面
    header('location:http://localhost/dashboard/JS2010/week06/Day%2029-Day%2031_jquery/projectname/src/login.html');
}



