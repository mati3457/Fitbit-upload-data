<?php
    if(!empty($_FILES['file'])) {
        $file = $_FILES['file'];
        $date = date('Y-m-d_H-i');//, strtotime('-1 hour'));
        rename($file['tmp_name'], $file['name']);
        $month = date('F');
        $day = date('j');
        if (!is_dir("Data/$month")) {
            mkdir("Data/$month", 0777);
        }
        if (!is_dir("Data/$month/$day")) {
            mkdir("Data/$month/$day", 0777);
        }
        $destdir = "Data/$month/$day";

        $data=file_get_contents($file['name']);
        echo $data;
        $file_name = $file['name'];
        file_put_contents($destdir."/".substr( $file_name,strrpos( $file_name,'/')), $data);
        unlink($file['name']);
    }
?>
