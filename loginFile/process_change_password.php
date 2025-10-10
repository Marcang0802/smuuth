<?php
require_once "model/common.php";

    // email and name cannot be blank nor empty string
$username = $_POST["username"];
$originalPw = $_POST["originalpassword"];
$newPw = $_POST["newPassword"];
$newConfirmPw = $_POST["newconfirmPassword"];
$errors = [];
$userdao = new UserDAO();
$user = $userdao -> get($username);
$status = false;
if(!$user){
    $errors[] = "Username not in database";
}
if($originalPw == $newPw){
    $errors[] = "New password and original password cannot be the same";
}
if(empty(trim($originalPw))){
    $errors[] = "Original password cannot be empty nor blank";
}
if(empty(trim($newPw))){
    $errors[] = "New password cannot be empty nor blank";
}
if($newPw !== $newConfirmPw){
    $errors[] = "The NEW passwords are different";
}
$realpw = $user -> getPasswordHash();
$passwordverify = password_verify($originalPw, $realpw);
if(!$passwordverify){
    $errors[] = "original password is invalid";
}
$_SESSION["errors"] = $errors;
    // Get the data from form processing and check data
if(count($errors)== 0){
    $newhash = password_hash($newConfirmPw, PASSWORD_DEFAULT);
    $user -> setPasswordHash($newhash);
    $status = $userdao-> update($user);
}

    
    // Check if password is valid
    

    // Errors to show in change_password.php
    
    // update the hased password in the database
    
    // if password is successfully changed, redirect to login.php
    // else reload the page

    if ( $status ) {
    // success; redirect
    $_SESSION["login_page"] = $username;
    header("Location: login.php");
    exit();
    }
    else {
        $_SESSION["pwd_change_fail"]= $username;
        $errors[] = "Error in update user user.";
        header("Location: change_password.php");
        exit;
    
    }

?>