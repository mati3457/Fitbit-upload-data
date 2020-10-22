<?php
    $file = $_FILES['file'];
    $date = date('Y-m-d_H-i');//, strtotime('-1 hour'));
    rename($file['tmp_name'], $file['name']);
    // zrobic tak zeby nazywać po ostatniej wartosci w pliku czy cos :) albo po czasie dodania do kolejki
?>
