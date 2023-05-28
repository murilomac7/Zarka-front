<?php
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if ($path == '/painel') {
        include_once 'painel.html';
    } else {
        include_once 'index.html';
    }
?>