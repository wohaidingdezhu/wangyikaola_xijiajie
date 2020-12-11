<?php
//cors解决跨越:所有的用户都可以访问。
header('Access-Control-Allow-Origin:*');  //允许任意的域名访问
header('Access-Control-Allow-Method:POST,GET'); //允许请求方式是get和post

//1.连接数据库
header('content-type:text/html;charset=utf-8');
define('HOST','localhost');//主机名
define('USERNAME','root');//用户名
define('PASSWORD','');//密码
define('DBNAME','taobao');//数据库名
$conn = @new mysqli(HOST,USERNAME,PASSWORD,DBNAME);

if($conn->connect_error){
    die('连接数据库错误,'.$conn->connect_error);//die():退出程序并返回括号里面的值。
}


//2.输出接口
$result=$conn->query("select * from taobaogoods");

$arr = array();

for($i=0;$i<$result->num_rows;$i++){
    $arr[$i] = $result->fetch_assoc();
}

echo json_encode($arr);