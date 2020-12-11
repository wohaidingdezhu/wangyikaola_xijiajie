<?php

//1.连接数据库
include "conn.php";

//2.获取前端出入的sid
if(isset($_GET['sid'])){
    $sid = $_GET['sid'];
    //查询这条数据返回给前端。
    $result=$conn->query("select * from taobaogoods where sid = $sid");//获取一条数据。
    echo json_encode($result->fetch_assoc());
}