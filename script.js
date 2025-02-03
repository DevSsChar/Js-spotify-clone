let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    // Ensure seconds is a whole number
    seconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format with leading zeros
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`./${folder}/`); // Replaced with relative path
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="svg/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("%26", " ")}</div>
                                <div>
                                    Dev
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="svg/play.svg" alt="" style="filter:invert(1)">
                            </div>
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `./${currFolder}/` + track; // Replaced with relative path
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    // when music is playing, change the button to pause button
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums(params) {
    let a = await fetch(`./songs/`); // Replaced with relative path
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes("%20") ) {
            let folder = e.href.split("/").slice(-2)[1]; // remove leading/trailing slashes
            console.log(`Fetching info from: ./songs/${folder}/info.json`);
            console.log(e)
            console.log(e.href);
            console.log(e.href.split("/").slice(-2, -1)[0])
            console.log(folder)
            // get metadata of folders
            if (folder != "songs") {
                let a = await fetch(`./songs/cs/info.json`); // Replaced with relative path
                let response = await a.json();
                // get json file
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" fill="#1DB954">
                                <!-- Circular background -->
                                <circle cx="24" cy="24" r="24" fill="#1DB954" /> <!-- Spotify green -->

                                <!-- Play icon -->
                                <path d="M18 34V14L34 24L18 34Z" fill="black" />
                            </svg>
                        </div>
                        <img src="./songs/${folder}/cover.jpg" alt=""> <!-- Replaced with relative path -->
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
            }
        }
    }

    // load library when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0], true);
        });
    });
}

async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0].replaceAll("%20", " "), true);

    // display the albums
    displayAlbums();

    // Attach an eventListener on play, next, and previous
    play.addEventListener("click", (e) => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    });

    // listen for time update
    currentSong.addEventListener("timeupdate", (a) => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // seekbar event listener
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.transform = "translateX(-1%)";
    });

    // for closing button
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.transform = "translateX(-100%)";
    });

    // add an event listener to prev and next
    previous.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " "));
        }
    });
    next.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replaceAll("%20", " "));
        }
    });

    // add volume and range event listener
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("svg/volume.svg")) {
            e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg");
        }
    });
}

main();

