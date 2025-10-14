<?php

class pointsDAO
{
    // getPoints()
    // Takes in the userID and gives out the amount of points user has.
    // Input: database access details (un=username, pw=password)
    //        userID (int)
    // Output: user points (str)
    public function getPoints($un, $pw, $userID)
    {
        // <!-- connect to database -->
        $dsn = "mysql:host=Host;dbname=dbname;port=port";
        $pdo = new PDO($dsn, $un, $pw);
        // <!-- sql statement -->
        $sql = 'SELECT points FROM table WHERE ID=:userID';
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':userID', $userID, PDO::PARAM_STR);
        // <!-- sql execution -->
        $stmt->execute();
        // <!-- getting result -->
        $result = null;
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        if ($row = $stmt->fetch()) {
            $result = $row['points'];
        }
        // <!-- cleaning up -->
        $stmt = null;
        $pdo = null;
        // <!-- return result -->
        return $result;
    }

    // updatePoints()
    // Input:
    // -database access details (un=username, pw=password)
    // -userID : ID of user
    // -operator (+ or -) : determine whether to add or deduct
    // -num : number of points to add or deduct
    // Output
    // -True or False
    public function updatePoints($un, $pw, $userID, $operator, $num)
    {
        // <!-- connect to database -->
        $dsn = "mysql:host=Host;dbname=dbname;port=port";
        $pdo = new PDO($dsn, $un, $pw);
        // <!-- sql statement -->
        if ($operator == '+') {
            $sql = 'UPDATE table SET points = points + :num WHERE ID = :userID';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':num', $num, PDO::PARAM_STR);
            $stmt->bindParam(':userID', $userID, PDO::PARAM_STR);
        } else if ($operator == '-') {
            $sql = 'UPDATE table SET points = points - :num WHERE ID = :userID';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':num', $num, PDO::PARAM_STR);
            $stmt->bindParam(':userID', $userID, PDO::PARAM_STR);
        }
        // <!-- sql execution -->
        if ($stmt->execute()) { // check if statement succesfully executed
            // cleaning up
            $stmt = null;
            $pdo = null;
            return true;
        }
        //unsuccessful
        return false;
    }
}
