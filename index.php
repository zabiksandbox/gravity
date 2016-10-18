<html>
<head>
	<script src='jquery.js'></script>
	<script src='fabric.js'></script>
	<script src='js.js'></script>
</head>
<style>
#frame {cursor: crosshair; overflow: hidden; width:100%; heght:100%;}
.object{position:absolute; width:1px; height:1px; }
.round{position: absolute;border:1px solid #fff; background-color: #fff; box-shadow: 0px 0px 5px #FFFF00;  cursor: pointer;}
body{margin:0px; padding:0px; overflow: hidden; width: 100%; height:100%; font-family: Consolas;}
.info{padding:10px; background-color: rgba(0,0,0,0.5); color:#fff; position: absolute;top:0px; left: 0px; z-index:9999;}
.info > div {display:inline-block;padding:0 20px;height:20px; line-height: 20px;}
.info > div *{line-height: 20px;}
.particle{color:#fff;width:1px;height:1px; border-radius: 2px;position: absolute;}
.defmass input{width:35px;}
</style>
<body>
<div class='info'>
    <div class='stars'>Particles: <span class='val'></span></div>
    <div class='gravity'>Gravity: <input type='range' min='-50'  value='1' max='50'/><span class='val'>0.1</span></div>
    <div class='pong'>Inf space: <input type='checkbox' value='1' checked=""/></div>
    <div class='freez'><input type='button' value='Reset force'/></div>
    <div class='grid'><input type='button' value='do grid' onclick="dogrid();"/></div>
    <? if($_GET['test']==1){?><div class='defmass'>Default mass:<input type='number' value='1' /></div><?}?>
</div>
<div id='templateobject'><div class='round'></div></div>
<div id='#particle'><div class='round'></div></div>
<canvas id='frame'></canvas>

</body>
</html>