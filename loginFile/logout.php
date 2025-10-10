<?php

session_start();

    // WRITE YOUR CODES HERE

if(!isset($_SESSION["username"])){
    header("Location:login.php");
    exit;
}else{
    echo "<h1>Thank you {$_SESSION['username']} for visiting</h1><br>";
    echo "<a href='login.php'>Home</a>'";
    $_SESSION = [];
}
    

?>