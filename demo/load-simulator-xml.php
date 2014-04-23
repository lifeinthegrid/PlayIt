<?php 

$_REQUEST['audio_count'] = isset($_REQUEST['audio_count']) ?  $_REQUEST['audio_count'] : 100;

$audioData = array(
	array("artist" => "One Republic", 
					  "album"  => "Dreaming Out Loud",
					  "title"  => "Say All I Need",
					  "poster" => "music/One Republic/Dreaming Out Loud/cover.jpg",
					  "thumb"  => "music/One Republic/Dreaming Out Loud/cover-thumb.jpg",
					  "src" => "music/One Republic/Dreaming Out Loud/01 Say (All I Need).mp3",
					  "desc"   => "Desc 1",
					  "size"   => "1.0 MB",
					  "length" => "1:00"), 
	  array("artist" => "One Republic", 
					  "album"  => "Dreaming Out Loud",
					  "title"  => "Mercy",
					  "poster" => "music/One Republic/Dreaming Out Loud/cover.jpg",
					  "thumb"  => "music/One Republic/Dreaming Out Loud/cover-thumb.jpg",
					  "src" => "music/One Republic/Dreaming Out Loud/02 Mercy.mp3",
					  "desc"   => "Desc 2",
					  "size"   => "1.1 MB",
					  "length" => "1:10"),
	 array("artist" => "One Republic", 
					  "album"  => "Wakeing Up",
					  "title"  => "All the Right Moves",
					  "poster" => "music/One Republic/Waking Up/cover.jpg",
					  "thumb"  => "music/One Republic/Waking Up/cover-thumb.jpg",
					  "src" => "music/One Republic/Waking Up/02 All the right Moves.mp3",
					  "desc"   => "Desc 3",
					  "size"   => "2.0 MB",
					  "length" => "2:00"), 
	 array("artist" => "One Republic", 
					  "album"  => "Wakeing Up",
					  "title"  => "Good Life",
					  "poster" => "music/One Republic/Waking Up/cover.jpg",
					  "thumb"  => "music/One Republic/Waking Up/cover-thumb.jpg",
					  "src" => "music/One Republic/Waking Up/06 Good Life.mp3",
					  "desc"   => "Desc 4",
					  "size"   => "2.1 MB",
					  "length" => "2:10"), 												  
	  array("artist" => "U2", 
					  "album"  => "Joshua Tree",
					  "title"  => "Still Haven't Found What I'm Looking For",
					  "poster" => "music/U2/Joshua Tree/cover.jpg",
					  "thumb"  => "music/U2/Joshua Tree/cover-thumb.jpg",
					  "src" => "music/U2/Joshua Tree/02 I Still Havent Found What Im Looking For.mp3",
					  "desc"   => "Desc 5",
					  "size"   => "3.0 MB",
					  "length" => "3:00"), 
	  array("artist" => "U2", 
					  "album"  => "Joshua Tree",
					  "title"  => "Where the Steets Have No Name",
					  "poster" => "music/U2/Joshua Tree/cover.jpg",
					  "thumb"  => "music/U2/Joshua Tree/cover-thumb.jpg",
					  "src" => "music/U2/Joshua Tree/01 Where the Streets Have No Name.mp3",
					  "desc"   => "Desc 6",
					  "size"   => "3.1 MB",
					  "length" => "3:10"), 												  	  
		);
		
$imageData = array(
	array("group" => "Group 1", 
					  "title"  		=> "Flamingos",
					  "thumb"  		=> "pictures/zoo_1_thumb.jpg",
					  "src" 		=> "pictures/zoo_1.jpg",
					  "location"   	=> "San Diego",
					  "size"   		=> "180K"), 	
	array("group" => "Group 2", 
					  "title"  		=> "Giraffe",
					  "thumb"  		=> "pictures/zoo_2_thumb.jpg",
					  "src" 		=> "pictures/zoo_2.jpg",
					  "location"   	=> "San Diego",
					  "size"   		=> "174K"), 	
	array("group" => "Group 3", 
					  "title"  		=> "Monkey",
					  "thumb"  		=> "pictures/zoo_3_thumb.jpg",
					  "src" 		=> "pictures/zoo_3.jpg",
					  "location"   	=> "San Diego",
					  "size"   		=> "187K"), 
	);
				
				
				
echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<playit
	toolbar-title="Simulator"
	accordion-animate="true">
		<section name="Large File">
			<category
				type="audio"
				name="Audio">
				<grid sort-column="title" sort-direction="asc">
					<fields>
						<field match="title" display="My Title" />
						<field match="artist" display="Artist" />
						<field match="album" display="Album" />
						<field match="length" display="Length" />
						<field match="size" display="Size" />
					</fields>
				</grid>
				<list sort-column="title" sort-direction="asc">
					<fields>
						<field match="title" display="My Title" />
						<field match="artist" display="Artist" />
						<field match="album" display="Album" />
					</fields>
				</list>				
				<?php
				for ($i = 0; $i <= $_REQUEST['audio_count']; $i++) {
				$artist = $audioData[rand(0, 7)];
	echo <<<EOT
			 <audio
				title="{$artist['title']}"
				src="{$artist['src']}"
				album="{$artist['album']}"
				artist="{$artist['artist']}"
				poster="{$artist['poster']}"
				thumb="{$artist['thumb']}"
				desc="{$artist['desc']}"
				size="{$artist['size']}"
				length="{$artist['artist']}">
				<info>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor diam non mauris vehicula hendrerit. Duis eget nisl vitae felis ultricies facilisis consequat at ipsum. 
					Donec dapibus sagittis nunc in interdum. Fusce sem sem, egestas sed convallis vel, pulvinar non felis. Vestibulum sit amet eros lectus, vitae scelerisque metus. 
					Morbi quis urna ut leo faucibus malesuada facilisis sit amet dui. Mauris at dolor massa. Cras convallis massa a sapien pharetra rutrum. Integer varius, neque non 
					ullamcorper ultrices, dui risus congue sapien, quis porttitor felis nibh ac metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
					Maecenas sed dapibus metus. Ut vel dui quis libero interdum hendrerit. Nulla pharetra interdum nisl eget sagittis. Aenean accumsan, erat quis fringilla gravida, ante leo 
					porttitor odio, ac ullamcorper mauris massa id libero.
				</info>
			</audio>
EOT;
				}
				?>
			</category>
			
			<!-- IMAGE DATA -->
			<category
				type="image"
				name="Image">
				<grid sort-column="title" sort-direction="asc">
					<fields>
						<field match="title" display="My Title" />
						<field match="location" display="Location" />
						<field match="size" display="Size" />
					</fields>
				</grid>
				<list sort-column="title" sort-direction="asc">
					<fields>
						<field match="title" display="My Title" />
						<field match="location" display="Location" />
						<field match="size" display="Size" />
					</fields>
				</list>				
				<?php
				for ($i = 0; $i <= $_REQUEST['audio_count']; $i++) {
				$item = $imageData[rand(0, 2)];
	echo <<<EOT
			 <img
				title="{$item['title']}"
				src="{$item['src']}"
				thumb="{$item['thumb']}"
				location="{$item['location']}"
				size="{$item['size']}">
				<info>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor diam non mauris vehicula hendrerit. Duis eget nisl vitae felis ultricies facilisis consequat at ipsum. 
					Donec dapibus sagittis nunc in interdum. Fusce sem sem, egestas sed convallis vel, pulvinar non felis. Vestibulum sit amet eros lectus, vitae scelerisque metus. 
					Morbi quis urna ut leo faucibus malesuada facilisis sit amet dui. Mauris at dolor massa. Cras convallis massa a sapien pharetra rutrum. Integer varius, neque non 
					ullamcorper ultrices, dui risus congue sapien, quis porttitor felis nibh ac metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
					Maecenas sed dapibus metus. Ut vel dui quis libero interdum hendrerit. Nulla pharetra interdum nisl eget sagittis. Aenean accumsan, erat quis fringilla gravida, ante leo 
					porttitor odio, ac ullamcorper mauris massa id libero.
				</info>
			</img>
EOT;
				}
				?>
			</category>			
	</section>
</playit>
	


