<?php

if(isset($_GET['userId']) && isset($_GET['mapSize']) && isset($_GET['objects']) && isset($_GET['proId'])){
    $myPDO = new PDO('sqlite:database\congDB.db');
    $argOne = $myPDO->query("SELECT * from projects WHERE id=".$_GET['proId']);

    if($argOne->fetch() != true){
        $complete = $myPDO->exec("INSERT INTO projects (userId, mapSize, objects) VALUES (".$_GET['userId'].",'".$_GET['mapSize']."', '".$_GET['objects']."' )");
        echo "false";
    }else{
        $complete = $myPDO->exec("UPDATE projects SET userId = ".$_GET['userId'].", mapSize = '".$_GET['mapSize']."', objects = '".$_GET['objects']."' WHERE id = ".$_GET['proId']." ");
        echo "true";
    }

    
}