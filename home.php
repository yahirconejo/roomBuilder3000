<?php

  if(!isset($_GET['id'])){
    header("Location:./index.php");
    die();
  }

?>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" type="text/css" href="home.css">
</head>
<body>
  <div id="title">
    <div id="userName">
      <p>TestUser123</p>
    </div>
  </div>

  <div id="section1">
    <h1> Projects</h1>
    <div id="boxes">
      <?php
        $myPDO = new PDO('sqlite:database\congDB.db');
        $allProjects = $myPDO->query("SELECT * FROM projects WHERE userId = ".$_GET['id']);
        $didItRun = false;
        foreach($allProjects as $row){
          echo "<a class='box' href='build.php?proId=".$row['id']."&userId=".$_GET['id']."'>";
          echo "<h3> Width: ".json_decode($row['mapSize'])[0]."</h3>";
          echo "<h3> Height: ".json_decode($row['mapSize'])[1]."</h3>";
          echo "<h3> Objects: ".count(json_decode($row['objects']))."</h3>";
          echo "</a>";
          $didItRun = true;
        }
  
        if(!($didItRun)){
          echo "<p>Looks like you haven't made any projects. :( </p>";
        }
      ?>
    </div>
  </div>
  <div id="section2">
    <h1> Create New Object</h1>
    <div onclick="createNewMap()" id="addButton">
        <p>+</p>
    </div>
  </div>
  <div id="createOverlay">
        <form id="createForm" action="./build.php" method="get">
          <label for="mapWidth">Map Width:</label>
          <input type="number" name="mapWidth" min="1" max="15" required><br>
          <label for="mapHeight">Map Height:</label>
          <input type="number" name="mapHeight" min="1" max="15" required><br>
          <input type="hidden" name="userId" value="<?php echo $_GET['id'];?>">
          <input type="submit" value="Submit">
        </form>
  </div>
  <script>
      function createNewMap(){
        document.getElementById("createOverlay").style.display = "flex";
      }

      document.getElementById("createOverlay").addEventListener("click", closeNewMap, false);
      function closeNewMap(event){
        if(document.getElementById("createOverlay") == event.target){
          document.getElementById("createOverlay").style.display = "none";
        }
      }
  </script>
</body>

</html>