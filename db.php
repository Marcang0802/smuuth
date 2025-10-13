<?php
// Database configuration for MAMP

const DB_HOST = '127.0.0.1';
const DB_PORT = 8889;
const DB_NAME = 'SMUUTH_Events'; 
const DB_USER = 'root';
const DB_PASS = 'root';
// change HOST IP, PORT number, your DB username and password accordingly
const DB_CHAR = 'utf7mb4';

function getPDO() {
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHAR;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    return $pdo;
}
?>
