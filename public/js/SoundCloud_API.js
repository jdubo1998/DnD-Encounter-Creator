/* Gets the iframe for the SoundCloud widget. */
var SCiframe = document.getElementById('SCiframe');
var widget = SC.Widget(SCiframe);

/* Gets the buttons and gives them evenlisteners. */
var playlist;
var volS = document.getElementById('v_slider');
volS.addEventListener("input", volumeSlider);
var muteCB = document.getElementById('mute');
muteCB.addEventListener("click", mute);
var shuffleCB = document.getElementById('shuffle');
shuffleCB.addEventListener("click", shuffle);
document.getElementById('playtrack').addEventListener("click", playTrack);
document.getElementById('next').addEventListener("click", playNext);

widget.bind(SC.Widget.Events.READY, onReady);
widget.bind(SC.Widget.Events.FINISH, playNext);
widget.bind(SC.Widget.Events.PLAY,function(){if(!shuffleCB.checked){setNext();}});

var playlistlength;
var nextIndex;

function playTrack() {
	var trackurl = document.getElementById('trackurl').value;
	var options = {show_comments:false,show_user:false,buying:false,sharing:false,show_playcount:false,hide_related:true,callback:onReady};
	widget.load(trackurl,options);
}

function updateNext() {
	widget.getSounds(function(sounds){
		document.getElementById('nextTitle').innerHTML=sounds[nextIndex].title;
	});
}

function setNext() {
	if (shuffleCB.checked) {
		widget.getSounds(function(sounds){
			do {
				nextIndex = Math.floor(Math.random() * (sounds.length)+1);
			} while(sounds[nextIndex].title==undefined);
			nextIndex--;
			
			document.getElementById('nextTitle').innerHTML=sounds[nextIndex].title;
		});
	} else {
		widget.getCurrentSoundIndex(function(index){
			if (index+1 >= playlistLength) {
				nextIndex=0;
			} else {
				nextIndex = index+1;
			}
			
			updateNext();
		});
	}
}

function playNext() {
	widget.skip(nextIndex);
	setNext();
}

function mute() {
	if (muteCB.checked) {
		widget.setVolume(0);
	} else {
		widget.setVolume(volS.value);
	}
}

function volumeSlider() {
	document.getElementById('volume').innerHTML="Volume: "+volS.value+"%";
	if (!muteCB.checked) {
		widget.setVolume(volS.value);
	}
}

function shuffle() {
	setNext();
}

function trackfromplaylist() {
	if (!shuffleCB.checked) {
		setNext();
	}
}

function onReady() {
	widget.getSounds(function(sounds){
		nextIndex = 0;
		playlistLength = sounds.length;
		setNext();
		//printInfo();
	});
}

function printInfo() {
	console.log("playlistLength: "+playlistLength);
	console.log("nextIndex: "+nextIndex);
}