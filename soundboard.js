var lastTabID = 0;

function createTab(name){

	// Create div and title header. Then add appropriate settings.
	var div = document.createElement("div");
	var tab = document.createElement("li");
	var title = document.createElement('a');
	title.href= "#tab"+lastTabID;
	
	id = "#tab"+lastTabID;
	console.log(id);
	title.setAttribute("data-toggle","tab");
	title.appendChild(document.createTextNode(name))
	
	tab.appendChild(title)
	
	div.className = "tab-pane fade";
	div.id = "tab"+lastTabID;
	div.setAttribute('name',name);
	// Add all created objects
	document.getElementById('tabs').appendChild(tab);
	document.getElementById('contents').appendChild(div);
	//document.getElementById('content').appendChild(div);
	// Return newly created object

	lastTabID++;
}
// Container to keep all sounds in one place. This is a Dictionary within a dictionary to be able to search by catagory.
var sounds = {};

// Counter to keep track of unique ID's
var lastID = 0;




// Base class for initializing the Sound class
var Base = function(methods){
	var base = function() {    
        this.initialize.apply(this, arguments);          
    };  
    
    for (var property in methods) { 
       base.prototype[property] = methods[property];
    }
          
    if (!base.prototype.initialize) base.prototype.initialize = function(){};      
    
    return base;    
};

//Complete class for the Sound object. Generates its own DIV's and HTML5 tags to play stuff.
var Sound = Base({ 
	// Init all the variables. 
    initialize: function(name, file, target='Sounds',shortcut=null) {
        this.name = name;
		this.file = file
		this.button = null;
		this.audioelement;
		this.id = lastID + 1;
		this.target = target;
		this.shortcut = shortcut;
		if(shortcut > 9){
			this.shortcut = null;
		}
		lastID ++;


		// Check if the catagory is there, if not: create it with a placeholder object
		var catagory = sounds[this.target];
		if(catagory == null){
			sounds[this.target] = {999:null};
			console.log(sounds)

		}
		sounds[this.target][this.id] = this;

		// Call init function
		this.init();
    },
	
	play : function() {
		obj = this
		if(obj.audioelement.paused == true){
			obj.audioelement.volume = 0.0;
			obj.audioelement.play();
			obj.fade(false)	
		}else{
			obj.stop()
		}
		
	},
	stop : function(){

		obj = this;
		if(obj.audioelement.paused != true){
			obj.fade(true);
		}
		
	},
	fade : function(fadeout){
		obj = this;
		var fadeOut = fadeout;

	var sound = obj.audioelement;
		var fadePoint = sound.duration - 2; 
		if(fadeOut == true){
			fadePoint = 2;
		}
		
    	var fadeAudio = setInterval(function () {
    		console.log('fading sound '+obj.name)
	        // Only fade if past the fade out point or not at zero already
	        if ((sound.currentTime >= fadePoint) && (sound.volume != 0.0) && fadeOut) {
	            sound.volume -= 0.1;
	        }
	        if ((sound.currentTime <= fadePoint) && (sound.volume != 1.0) && !fadeOut ) {
	            sound.volume += 0.1;
	        }
	        // When volume at zero stop all the intervalling
	        if ((sound.volume < 0.1 && fadeOut) || (sound.volume > 0.9 && !fadeOut)) {
	            clearInterval(fadeAudio);
	            if(fadeOut){
	            	sound.volume = 0;
	            	sound.pause();
	            }
	        }

    	}, 200);
	},
	init : function(){

		// Statement for JS class based shenanigans.
		obj = this


		div = document.createElement('div');
		// Create a button and add some text to it
		obj.button = document.createElement("BUTTON");
		obj.button.appendChild(document.createTextNode(obj.name));

		// Set ID's and names to keep track of this button
		obj.button.id = obj.id;
		obj.button.name = obj.target;

		// Get or create parent element. Used for catagory based display
		var el = getOrCreateElement(obj.target,obj.target)
		if(obj.shortcut != null){
			a = document.createElement('a')
			a.appendChild(document.createTextNode(obj.shortcut))
			div.appendChild(a);
		}
		div.appendChild(obj.button);
		el.appendChild(div);

		// Create audio element and set appropriate settings
		obj.audioelement = document.createElement("AUDIO");
		obj.audioelement.src = obj.file;
		obj.audioelement.name
		obj.button.appendChild(obj.audioelement);

		// Add function to play/pause to button
		obj.button.onclick = buttonClicked;
	}
	
	
});

// Function that creates an element or returns existing element
function getOrCreateElement(id,name){
	var el = document.getElementById(id);
	// Check if element is there
	if(el == null){

		// Create div and title header. Then add appropriate settings.
		var div = document.createElement("div");
		var title = document.createElement("h2");
		title.innerHTML = id;
		div.id = id;
		div.className = "buttons";
		// Add all created objects
		console.log(name)
		document.getElementsByName(name)[0].appendChild(title);
		document.getElementsByName(name)[0].appendChild(div);
		// Return newly created object
		return document.getElementById(id);
	}else{
		// Return found object
		return el;
	}
}
function buttonClicked(){
	// Fetch sound from dicionary container using the name and id from the button [SET AT SOUND.INIT()]
	var sound = sounds[this.name][this.id];
	// Call the play function in [SOUND]
	sound.play();
}
function stopAll(){
	// Scroll through the entire dictionary
	for ( var key in sounds){
		for ( var id in sounds[key]){
			// Check if the sound is not a placeholder
			if(id == 999){
				continue;
			}
			// Check if the object is an object
			if (typeof sounds[key][id] !== 'object') {
 			   continue;
			}
			// Call stop function with fetched object.
			var sound = sounds[key][id];
			sound.stop();
		}
	}
}

function getScript(url, callback) {
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   script.onreadystatechange = callback;
   script.onload = callback;

   document.getElementsByTagName('head')[0].appendChild(script);
}

// Create the Stop All button at the top
var button = document.createElement("BUTTON");
button.appendChild(document.createTextNode("Stop All"));
document.getElementById('page-header').appendChild(button);
button.onclick = stopAll;


// Variable to keep track of current shortcut mode
var mode = "none";



// Dictionary to map keys to different cacagories
// Match these shortcut modifier keys to your target of your sound.
var modes = {
	'A' : 'Age of Sail',
	'B' : 'none',
	'C' : 'none',
	'D' : 'none',
	'E' : 'none',
	'F' : 'none',
	'G' : 'none',
	'H' : 'none',
	'I' : 'none',
	'J' : 'none',
	'K' : 'none',
	'L' : 'none',
	'M' : 'none',
	'N' : 'none',
	'O' : 'none',
	'P' : 'none',
	'Q' : 'none',
	'R' : 'none',
	'S' : 'none',
	'T' : 'none',
	'U' : 'none',
	'V' : 'none',
	'W' : 'none',
	'X' : 'none',
	'Y' : 'none',
	'Z' : 'none',

}
// Create new sounds. No need to store them manually, this is done in the init function of [SOUND]

function addModule(title,shortcut = null){
	createTab(title);
	if(shortcut){
		modes[shortcut] = title;
	}
	getScript(escape(title)+'/files.js', function(){
		for (var i = 0; i < soundfiles.length; i++){
			new Sound(soundfiles[i],escape(title)+"/"+soundfiles[i],title,i);
		}
	});	
}

addModule("The Dungeon");
addModule("Dark Forest","D");
addModule("The Tavern");



// Create keyDown listener and call the [checkKey()] function
document.onkeydown = checkKey;


function checkKey(e){
	e = e || window.event;
	// Get character with the keyCode
	var char = String.fromCharCode(e.keyCode)

	// Check if keycode is a number in stead of a character
	if(e.keyCode >= 48 && e.keyCode <= 57 && mode != "none"){
		playSound(e.keyCode);
	}
	else{
		// Fetch appropriate mode from the modes dictionary
		mode = modes[char];
	}

}


function playSound(number){
	// Get the current catagory using the mode variable, set before in the [checkKey] function
	var soundBank = sounds[mode];
	// Init empty dict
	var numSounds = {};
	var i = 0;
	// Scroll through every sound. This is done to convert the global ID's to local, catagory based ID's. e.g. from 58-64 to 0-6
	for(var key in soundBank){
		// Check if sound is placeholder.
		if(key == 99){
			break;
		}
		// Store the sound at the corrected index
		numSounds[i] = soundBank[key];
		// Increment index counter
		i++
	}
	// Rework the keyboard code to actual numbers. the key 0 is 48, so if you subtract 48 from the number, you get the number pressed
	number -= 48;
	// Play stored number
	console.log(numSounds[number].name);
	numSounds[number].play();
}