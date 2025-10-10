<html>
    <body>
        <a href="login.php"> Home </a> |
        <a href="logout.php"> Logout </a>
        <br/>
    </body>
</html>

<?php
// require_once "model/common.php";

session_start();

echo "<h3> Welcome ". $_SESSION["username"] .  ". You have login successfully </h3>";
echo "Not so secret stuff. But only for registered users";

?>
