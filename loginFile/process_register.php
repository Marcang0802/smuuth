<?php
require_once "model/common.php";

    $errors = [];
    $userdao = new UserDAO();
    $status = false;

    // Get the data from form processing
    $username = $_POST["username"];
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirmPassword"];
    $role = $_POST["role"];

    // Check if username is already taken
    if($userdao-> get($username)){
        $errors[] = "Username already taken";
    }
    

    // If one or more fields have validation error
    if(empty(trim($username))){
        $errors[] = "Username cannot be empty";
    }
    if(empty(trim($password))|| empty(trim($confirmPassword)) ){
        $errors[] = "Password cannot be empty";
    }
    if($password !== $confirmPassword){
        $errors[] = "Passwords don't match";
    }

    // if everything is checked. Create user Object and write to database
    if(count($errors)== 0){
        $passwordhash = password_hash($password, PASSWORD_DEFAULT);
        $newuser = new User($username, $passwordhash, $role);
        $userdao -> create($newuser);
        $status = true;
    }


if ( $status ) {
    // success; redirect page
    $_SESSION["login_page"] = $username;
    header("Location: login.php");
    exit();
}else{
    $_SESSION["register_fail"] = $username;
    $_SESSION["errors"] = $errors;
    header("Location: register.php");
    exit();
}
    
?>

