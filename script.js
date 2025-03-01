let currentSong = new Audio();
let songs = [];
let currFolder = "";

// Get control elements from the DOM
const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

// Manifests for songs and album metadata
const songsManifest = {
    "songs/ncs": ["Abroad Again - Jeremy Blake.mp3", "Blue Ribbons - TrackTribe.mp3", "Colony - TrackTribe.mp3", "Decimate - Jeremy Blake.mp3", "Final Girl - Jeremy Blake.mp3", "FIVE OF A KIND - Density Time.mp3", "Girl On Top - Amy Lynn the Honeymen.mp3"],
    "songs/cs": ["Ravan theme song.mp3", "Veera Randheera.mp3", "Pehla Pyaar.mp3", "Kalki theme song.mp3", "aaj ki rat.mp3", "mere mehboob.mp3"]
};

const albumsManifest = {
    "ncs": {
        title: "NCS Album",
        description: "Non Copyrighted Songs"
    },
    "cs": {
        title: "CS Album",
        description: "Cool Songs"
    }
};

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    // Instead of fetching a directory listing, use our songs manifest
    currFolder = folder;
    songs = songsManifest[folder] || [];

    const songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
      <img src="svg/music.svg" alt="">
      <div class="info">
        <div>${song.replaceAll("%20", " ").replaceAll("%26", " ")}</div>
        <div>Dev</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img src="svg/play.svg" alt="" style="filter:invert(1)">
      </div>
    </li>`;
    }

    // Add click event for each song item
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const trackName = e.querySelector(".info div").innerText.trim();
            playMusic(trackName);
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `./${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";
    for (const albumKey in albumsManifest) {
        const album = albumsManifest[albumKey];
        cardContainer.innerHTML += `<div data-folder="${albumKey}" class="card">
      <div class="play">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" fill="#1DB954">
          <circle cx="24" cy="24" r="24" fill="#1DB954" />
          <path d="M18 34V14L34 24L18 34Z" fill="black" />
        </svg>
      </div>
      <img src="./songs/${albumKey}/cover.jpg" alt="">
      <h2>${album.title}</h2>
      <p>${album.description}</p>
    </div>`;
    }

    // Add click event for each album card to load its songs
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            const folder = `songs/${e.dataset.folder}`;
            songs = await getSongs(folder);
            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

async function main() {
    songs = await getSongs("songs/ncs");
    if (songs.length > 0) {
        playMusic(songs[0]);
    }
    displayAlbums();

    // Toggle play/pause when the play button is clicked
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    });

    // Update song time and seekbar as the song plays
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar click event to jump to a new time
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Mobile hamburger menu and close button
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(-1%)";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.transform = "translateX(-100%)";
    });

    // Previous and next buttons
    previous.addEventListener("click", () => {
        const currentFileEncoded = currentSong.src.split("/").pop();
        const currentFile = decodeURIComponent(currentFileEncoded);
        const index = songs.indexOf(currentFile);
        // If at first song or not found, go to last; otherwise go to previous
        const newIndex = (index <= 0) ? songs.length - 1 : index - 1;
        playMusic(songs[newIndex]);
    });

    next.addEventListener("click", () => {
        const currentFileEncoded = currentSong.src.split("/").pop();
        const currentFile = decodeURIComponent(currentFileEncoded);
        const index = songs.indexOf(currentFile);
        // If at last song or not found, go to first; otherwise go to next
        const newIndex = (index === -1 || index >= songs.length - 1) ? 0 : index + 1;
        playMusic(songs[newIndex]);
    });

    // When a song ends, automatically play the next song (circularly)
    currentSong.addEventListener("ended", () => {
        const currentFileEncoded = currentSong.src.split("/").pop();
        const currentFile = decodeURIComponent(currentFileEncoded);
        const index = songs.indexOf(currentFile);
        const newIndex = (index === -1 || index >= songs.length - 1) ? 0 : index + 1;
        playMusic(songs[newIndex]);
    });


    // Volume control and mute toggle
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("svg/volume.svg")) {
            e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
            e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg");
        }
    });
}

main();
