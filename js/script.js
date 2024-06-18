
let currFolder;
let songs;
let currSong = new Audio();
let play = document.querySelector("#play")

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder){
    currFolder = folder
    let a = await fetch(`/${folder}`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])/////////////////////////////////////////
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img src="img/music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Anirudh</div>
                            </div>
                            <div class="playnow">
                                <img src="img/playnow.svg" class="invert" alt="">
                            </div></li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click" , element=>{
            playMusic(`${currFolder}/${e.querySelector(".info").firstElementChild.innerHTML}`)
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    currSong.src = (track)
    if (!pause) {
        currSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.split(`${currFolder}/`))
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){

    await getsongs("songs/movieSong")
    playMusic(`${currFolder}/${songs[0]}`, true)

    

    play.addEventListener("click", ()=>{
        if (currSong.paused) {
            currSong.play()
            play.src = "img/pause.svg"
        }else{
            currSong.pause()
            play.src = "img/play.svg"
        }
    })

    currSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent  = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent+"%";
        currSong.currentTime = ((currSong.duration) * percent)/100 ;
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click" , ()=>{
        currSong.pause()
        let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
        if ((index-1) >= 0) {
            playMusic(`${currFolder}/${songs[index-1]}`)
        }else{
            playMusic(`${currFolder}/${songs[(songs.length)-1]}`)
        }
    })

    next.addEventListener("click" , ()=>{
        currSong.pause()
        let index = songs.indexOf(currSong.src.split("/").slice(-1) [0])
        if ((index+1) < (songs.length)) {
            playMusic(`${currFolder}/${songs[index+1]}`)
        }else{
            playMusic(`${currFolder}/${songs[0]}`)
        }
    })

    // volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currSong.volume = parseInt(e.target.value) / 100
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(`${currFolder}/${songs[0]}`)
        })
    })

    document.querySelector(".vol>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
}
main()