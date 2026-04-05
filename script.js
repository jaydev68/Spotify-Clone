
console.log('Lets write JavaScript')
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/songs/${folder}/`)
    let response = await a.text();
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            let url = element.href;

            let name = decodeURIComponent(url)
                .split(/[/\\]/)   // 🔥 handles BOTH / and \
                .pop()
                .replace(".mp3", "");


            songs.push({ name, url });

        }
    }
    return songs
}

// const playMusic = (track, pause = false) => {
//     currentSong.src = "/songs/" + track
//     if (!pause) {
//         currentSong.play()
//         play.src = "pause.svg"
//     }
//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
// }

const playMusic = (track, pause = false) => {
    if (!track) return;

    currentSong.src = track.url;

    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    else {
        play.src = "Play.svg";
    }

    document.querySelector(".songinfo").innerHTML = track.name; // ✅ use name
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}



async function main() {


    // Get the list of all the songs

    async function loadSongs(folder) {
        songs = await getSongs(folder);

        let songUL = document.querySelector(".songList ul");
        songUL.innerHTML = ""; // clear old songs

        for (const song of songs) {
            songUL.innerHTML += `
        <li>
            <img src="music.svg" class="invert">
            <div class="info">
                <div>${song.name}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="Play.svg" class="invert">
            </div>
        </li>`;
        }

        // click to play
        Array.from(document.querySelectorAll(".songList li")).forEach((e, index) => {
            e.addEventListener("click", () => {
                playMusic(songs[index]);
            });
        });

        // auto load first song
        if (songs.length > 0) {
            playMusic(songs[0], true);
        }
    }
    // songs = await getSongs("songs/gujarati")
    // playMusic(songs[0], true)



    // //show all the songs in play list
    // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    // for (const song of songs) {
    //     songUL.innerHTML += `<li data-url="${song.url}">

    //                     <img src="music.svg" alt="" class="invert">
    //                     <div class="info">
    //                         <div> ${song.name}</div>

    //                     </div>
    //                     <div class="playnow">
    //                         <span>Play Now</span>
    //                         <img src="Play.svg" alt="" class="invert">
    //                     </div>
    //                 </li>`;
    // }


  document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".left");
    const overlay = document.querySelector(".overlay");

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener("click", () => {
            sidebar.classList.add("active");
            overlay.classList.add("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

});









    // document.querySelectorAll(".songList li").forEach(li => {
    //     li.addEventListener("click", () => {
    //         audio.src = li.getAttribute("data-url");
    //         audio.play();
    //     });
    // });

    // // Optional: autoplay first song
    // if (songs.length > 0) {
    //     audio.src = songs[0].url;
    //     // audio.play();
    // }




    // Attach an event listener to each song
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    //     })
    // })
    Array.from(document.querySelectorAll(".songList li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(songs[index]);
        })
    })


    Array.from(document.querySelectorAll(".songList li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });

    // click on cards
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;

            console.log("Loading folder:", folder);

            await loadSongs(folder);
        });
    });


    // Attach an event listener to play, next and privious 

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "Play.svg"
        }
    })


    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} /${secondsToMinutesSeconds(currentSong.duration)}`
        if (!isNaN(currentSong.duration)) {
            let percent = (currentSong.currentTime / currentSong.duration) * 100;

            document.querySelector(".circle").style.left = percent + "%";
            document.querySelector(".progress").style.width = percent + "%";
        }
    })

    // seekbar update
    let seekbar = document.querySelector(".seekbar");

    seekbar.addEventListener("click", (e) => {
        let rect = seekbar.getBoundingClientRect();

        let percent = (e.clientX - rect.left) / rect.width;

        // set song time
        currentSong.currentTime = percent * currentSong.duration;

        // update UI instantly
        document.querySelector(".circle").style.left = percent * 100 + "%";
        document.querySelector(".progress").style.width = percent * 100 + "%";
    });

    // add an event listener to next and previous

    // previous.addEventListener("click",() =>{
    //     console.log("Previous clicked")
    //     console.log(currentSong)
    //     // let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    //     // if((index - 1) >= 0) {
    //     //     playMusic(songs[index-1])
    //     // }
    // })
    // next.addEventListener("click",() =>{
    //     console.log("Next clicked")
    //     console.log(currentSong.src)
    //     // let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
    //     // if ((index + 1) > length){
    //     //     playMusic(songs[index+1])
    //     // }
    //     console.log(songs)
    // })

    function getCurrentSongIndex() {
        return songs.findIndex(song => {
            return decodeURIComponent(song.url) === decodeURIComponent(currentSong.src);
        });
    }


    // PREVIOUS
    previous.addEventListener("click", () => {
        console.log("Previous clicked");

        let index = getCurrentSongIndex();
        console.log("Current index:", index);

        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]); // loop
        }
    });

    // NEXT
    next.addEventListener("click", () => {
        console.log("Next clicked");

        let index = getCurrentSongIndex();
        console.log("Current index:", index);

        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]); // loop
        }
    });






}

main()