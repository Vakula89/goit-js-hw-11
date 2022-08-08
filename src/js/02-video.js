import Player from "@vimeo/player";
import throttle from "lodash.throttle";

const iframe = document.querySelector('iframe');
const player = new Player(iframe);



player.on('play', function() {
    //console.log('played the video!');
    let seconds = localStorage.getItem("videoplayer-current-time");
    seconds = parseFloat(seconds);
    if(!seconds){
        seconds = 0;
    }
    player.setCurrentTime(seconds).then(function(seconds) {
        // seconds = the actual time that the player seeked to
        console.log('Time has set to: ' + seconds);
        player.off('play');
    }).catch(function(error) {
        switch (error.name) {
            case 'RangeError':
                console.error("the time was less than 0 or greater than the video’s duration");
                break;
    
            default:
                console.error("Vimeo player: error occurred",error);
                break;
        }
    });
} );

function onTimeUpdate(data) {
    //console.log("videoplayer-current-time",data);
    localStorage.setItem("videoplayer-current-time", data.seconds);
}

player.on('timeupdate', throttle(onTimeUpdate, 1000));

player.getVideoTitle().then(function(title) {
    console.log('title:', title);
});