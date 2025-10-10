<html>
    <body>
        <a href="login.php"> Home </a> |
        <a href="logout.php"> Logout </a>
        <br/>
    </body>
</html>

<?php
//require_once "common.php";

session_start();

echo "<h3> Welcome Admin ". $_SESSION["username"] .  ". You have login successfully </h3>";
echo "<Top secret stuff, for admin eyes only.";

?>
