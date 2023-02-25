<?php

	$_REQUEST['audio_count'] = isset($_REQUEST['audio_count']) ?  $_REQUEST['audio_count'] : 100;

?>

<!DOCTYPE html>
<html>
<head>
	<title>PlayIt - Load Simulator</title>
	<meta name="description" content="Create powerful media displays with PlayIt. PlayIt is your ultimate web based media player." />
	<link rel="stylesheet" href="../style.css" type="text/css" media="all" />
	<style>
		input.load-count {width: 60px}
	</style>

	<!-- ==============================================
	REQUIRED FOR PLAYIT. -->
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/smoothness/jquery-ui.css" id="playit-jquery-ui-css" media="screen" type="text/css" rel="stylesheet" />
	<link rel="stylesheet" href="../source/jquery.playit.css" type="text/css" media="all" />
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js"></script>
	<script id="playit-source" type="text/javascript" src="../source/jquery.playit.js"></script>
	<!-- ============================================== -->

	<script type="text/javascript" src="../config.js"></script>
	<script type="text/javascript">
		beforeload = (new Date()).getTime();
		function pageloadingtime()
		{
			afterload = (new Date()).getTime();
			seconds = (afterload-beforeload)/1000;
			window.status='You Page Load took  ' + seconds + ' second(s).';
			document.getElementById("loadingtime").innerHTML = "<font color='red'>(Page load took " + seconds + " second(s).)</font>";
		}

		function getSampleXml()
		{
			str = window.location.href;
			var path = str.substring(0, str.lastIndexOf("/"));
			window.open("view-source:" + path + "/load-simulator-xml.php");
		}
	</script>
</head>
<body>


	<!-- ==============================================
	TOP NAVIGATION -->
	<table class="top-nav">
		<tr>
			<td class="column-0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
			<td class="column-1">
				<h2>PlayIt - Load Simulator</h2>
				<span>Testing PlayIt with large data sets</span>
			</td>
			<td class="column-2">
				ThemeRoller Ready!<br/>
				<select id="theme" onchange="javascript:applyTheme(this.options[this.selectedIndex].text);">
					<option>cupertino</option>
					<option>black-tie</option>
					<option>blitzer</option>
					<option>excite-bike</option>
					<option>flick</option>
					<option>hot-sneaks</option>
					<option>humanity</option>
					<option>overcast</option>
					<option>pepper-grinder</option>
					<option>redmond</option>
					<option selected="true">smoothness</option>
					<option>south-street</option>
					<option>start</option>
					<option>sunny</option>
					<option>ui-lightness</option>
				</select>
			</td>
			<td class="column-3">
				<a href="../index.html">Main Menu</a>
				<div id="playit-version-mode"></div>
			</td>
		</tr>
	</table>


	<div class="content">

		<div>
			<form id="formData" method="Post">
			<table border="0">
				<tr>
					<td>
						Audio Nodes: <input name="audio_count" type="text" value="<?php echo	$_REQUEST['audio_count']  ?>" class="load-count" />
						<input type="submit" value="apply" />
					</td>
					<td><a href="javascript:void(0)" onclick="getSampleXml()" target="_blank">[sample xml]</a></td>
				</tr>
				<tr><td colspan="2"><p><div id="loadingtime"></div></p></td></tr>
			</table>
			</form>
		</div>


		<!-- ==============================================
		REQUIRED FOR PLAYIT. -->
		<div id="player" style="width:100%; height:600px"></div><br /><br />
		<script type="text/javascript">
		    var player = null;
			var audio_count = <?php echo $_REQUEST['audio_count'] ?>

		    jQuery(document).ready(function ()
		    {
				var xmlfile = "load-simulator-xml.php" + "?audio_count=" + audio_count;
		        player = jQuery("#player").playit(
				{
				    dataSourceOptions: {
						xmlConfig: xmlfile,
						cacheXml: false
					},
					onRenderComplete: function(){pageloadingtime();}
				});

            });

            function applyTheme(theme)
            {
                if (player)
                {
                    player.each(function ()  {this.playit.applyTheme(theme);  return; });
                }
            }

		</script>
		<!-- ============================================== -->

	</div>

</body>
</html>