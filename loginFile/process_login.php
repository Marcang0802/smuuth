<?php
    require_once 'model/common.php';


    $errors = [];
    $userdao = new UserDAO();

    // Get the data login.php
    $username = $_POST["username"];
    $password= $_POST["password"];
    // Create the DAO object to facilitate connection to the database.
    $user = $userdao -> get($username);
    // Check if the username exists
    if ($user)
    {
        // If username exists
        // get the hashed password from the database
        $hashed = $user -> getPasswordHash();
        $status = false;
        // Match the hashed password with the one which user entered
        // if it does not match. -> error
        $status = password_verify($password, $hashed); 
        
        // check if the plain text password is valid
        
        // if valid get the user role, and redirect the user according to the role

     
        if ($status)
        {   
            if($user-> getRole() == "admin"){
                $_SESSION["username"] = $username;
                header("Location: welcome_admin.php");
                exit;
            }
            $_SESSION["username"] = $username;
            header("Location: welcome.php");
            exit;
        }
        else
        {
            // password not valid
            // return to login page and show error
            $errors[] = "Invalid password";
            $_SESSION["errors"] = $errors;
            header("Location: login.php");
            exit;
        }

    } else
    {
     $errors[] = "Username does not exist in the database";
     $_SESSION["errors"] = $errors;
     header("Location: login.php");
     exit;
    }
    

?>

