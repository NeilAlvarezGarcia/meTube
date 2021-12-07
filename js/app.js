// Variables
const divSongs = document.querySelector(".songs");
const body = document.querySelector("body");
let audio;

// listener for the events
eventListener();
function eventListener() {

    // when the document is ready, uploads the document adding the songs
    document.addEventListener('DOMContentLoaded', initApp);
}

// creates and shows each song on the document
function initApp() {
    DBmusics.forEach(song => {
        const {reference, name} = song

        const div = document.createElement('DIV');
        div.className = "bg-white song";
        div.innerHTML = `
            <img src="img/${reference}.jpg" alt="image-song" class="imagen">
            <h2 class="song__text flex">${name}</h2>
        `;

        div.addEventListener("click", () => {            
            // calls the function that create the song which is playing
            showDiv(reference, name);
        });

        // adds each div of the songs to the DOM
        divSongs.appendChild(div);
    });
}


// shows the div of the song that is gonna play
function showDiv(song, texto) {
    if(!audio) {
        // Creates the new audio
        audio = new Audio(`songs/${song}.mp3`);
        audio.play();
        audio.ontimeupdate = () => {
            showTime();
            Finish();
            countTime()
        }
        
        // Variables, classes and actions of the song
        const div = document.createElement("DIV");
        div.classList.add("music", "flex");
        setTimeout(() => {
            div.style.transform = "scale(1)";
        }, 100);
    
        const content = document.createElement("DIV");
        content.classList.add("content", "bg-white", "shadow");
    
        const container = document.createElement("DIV");
        container.classList.add("music__container", "flex");
        container.style.backgroundImage = `url(img/${song}.jpg)`;
    
        const h2 = document.createElement("H2");
        h2.classList.add("shadow");
        h2.textContent = `${texto}`;
    
        const functions = document.createElement("DIV");
        functions.classList.add("funciones", "flex");

        const skipPlus = document.createElement("I");
        skipPlus.className = "skip acciones bx bx-revision plus";
        skipPlus.onclick = () => {
            audio.currentTime+= 5;
        }
        const skipLess = document.createElement("I");
        skipLess.className = "skip acciones bx bx-revision less";
        skipLess.onclick = () => {
            if(audio.currentTime > 0) {
                audio.currentTime-= 5;
            }
        }

        const iconPlay = document.createElement("I");
        iconPlay.classList.add("play", "acciones", "hide", "flex", "cl-white");
        iconPlay.innerHTML = "<i class='bx bx-play'></i>";
        
        const iconPause = document.createElement("I");
        iconPause.classList.add("stop", "acciones", "flex");
        iconPause.innerHTML = "<i class='bx bx-pause'></i>";
        
        const controls = document.createElement("DIV");
        controls.classList.add("utilidades", "bg-white", "shadow");
        controls.innerHTML = `
            <div class="time-audio"></div>
        `;
        const divDuration = document.createElement("DIV");
        divDuration.className = "duration";
        const divTime = document.createElement("DIV");
        divTime.className = "time";
        divDuration.appendChild(divTime);
        let click = false;

        divDuration.onclick = e => {
            point = (e.offsetX / divDuration.clientWidth) * audio.duration;
            audio.currentTime = point;
        }
        divDuration.onmousedown = () => {
            audio.pause();
            click = true;
        }
        divDuration.onmouseup = () => {
            audio.play();
            click = false;
        }
        divDuration.onmousemove = e => {
            if(click) {
                point = (e.offsetX / divDuration.clientWidth) * audio.duration;
                audio.currentTime = point;
            }
        }
        controls.appendChild(divDuration);
        
        const volume1 =  document.createElement("I");
        volume1.classList.add("bx", "bxs-volume-full", "full", "v");
        const volume2 =  document.createElement("I");
        volume2.classList.add("bx", "bxs-volume-low", "hide", "low", "v");
        const volume3 =  document.createElement("I");
        volume3.classList.add("bx", "bxs-volume-mute", "hide", "mute", "v");
        
        const input = document.createElement("INPUT");
        input.classList.add("changeVolume", "v");
        input.setAttribute("type", "range");
        input.setAttribute("min", "0");
        input.setAttribute("max", "1");
        input.setAttribute("step", "0.01");
        input.value = "1"; 
        
        const divInput = document.createElement("DIV");
        divInput.classList.add("input-container", "hide", "shadow", "bg-white", "v"); 
        
        const divDownload = document.createElement("DIV");
        divDownload.classList.add("descarga", "bg-white", "flex", "shadow");
        divDownload.innerHTML = `
            <a href="songs/${song}.mp3" download>
                <i class='bx bxs-download'></i>
            </a>
        `;
        
        const remove = document.createElement('DIV');
        remove.classList.add("delete", "flex");
        remove.innerHTML = `
            <div class="delete__enlace">
                <a href="#" class="cl-white">X</a>
            </div>
        `;

        // Listeners of play and pause action
        iconPlay.onclick = () => {
            audio.play();
            iconPlay.classList.add("hide");
            iconPause.classList.remove("hide");
        }
        iconPause.onclick = stopSong;
        // Listener of volume
        volume1.onclick = onVolume;
        volume2.onclick = onVolume;  
        volume3.onclick = onVolume; 
        // Listener to close the div
        remove.onclick = elimianrMusica;
        
        // adds everything to the div 
        divInput.appendChild(input);
        controls.appendChild(volume1);
        controls.appendChild(volume2);
        controls.appendChild(volume3);
        controls.appendChild(divInput);
        container.appendChild(h2);
        functions.appendChild(skipLess);
        functions.appendChild(iconPlay);
        functions.appendChild(iconPause);
        functions.appendChild(skipPlus);
        container.appendChild(functions);
        container.appendChild(controls);
        container.appendChild(divDownload);
        content.appendChild(container);
        div.appendChild(content)
        div.appendChild(remove);
        body.appendChild(div);
    }
}

// shows the time of the song
function showTime() {
    const divTime = document.querySelector(".duration");

    // Muestra el width de la duración de la canción
    let divDuration = Number(divTime.clientWidth);
    let timeBar = document.querySelector(".time");
    // Calcula la constante a usar para el avance de la canción
    let durationAudio = divDuration / audio.duration;
    // Tiempo recorrido por la canción
    let time = (durationAudio * audio.currentTime) / 10;
    
    timeBar.style.width = `${time}rem`;
}

// Controla el volumen de la canción
function onVolume() {
    const div = document.querySelector(".input-container");
    const input =  document.querySelector(".changeVolume");
    const volume1 = document.querySelector(".full");
    const volume2 = document.querySelector(".low");
    const volume3 = document.querySelector(".mute");

    // Muestra o esconde la barra del volumen
    if(div.classList.contains("hide")) {
        div.classList.remove("hide");
        div.classList.add("flex");
    
        input.oninput = e => {
            const vol = e.target.value;
            audio.volume = vol;
            
            // Cambia de icono de acorde a la cantidad de volumen
            if(vol > "0.5") {
                volume1.classList.remove("hide");
                volume2.classList.add("hide");
                volume3.classList.add("hide");
            } else if(vol > "0") {
                volume1.classList.add("hide");
                volume2.classList.remove("hide");
                volume3.classList.add("hide");
            } else {
                volume1.classList.add("hide");
                volume2.classList.add("hide");
                volume3.classList.remove("hide");
            }
        };
    } else {
        div.classList.add("hide");
        div.classList.remove("flex");
    }
    document.addEventListener("click", e => {
        if(!e.target.classList.contains("v")) {
            div.classList.add("hide");
            div.classList.remove("flex");
        }
    });
    
}

// Detiene la canción
function stopSong() {
    const iconoPlay = document.querySelector(".play");
    const iconoPause = document.querySelector(".stop");

    iconoPause.classList.add("hide");
    iconoPlay.classList.remove("hide");
    audio.pause();
}

// Remueve el div con la canción
 function elimianrMusica(e) {
     e.preventDefault();
    const div = document.querySelector(".music");
    div.style.transform = "scale(0)";

    setTimeout(() => {
        div.remove();
    }, 100)
    audio.pause();
    audio = "";
}

// Si la canción acabó, remueve el div
function Finish() {
    if(audio.ended) {
        const div = document.querySelector(".music");
        div.style.transform = "scale(0)";

        setTimeout(() => {
            div.remove();
        }, 100)
        audio = "";
    }
}

// shows the current time of the song
function timeSong(m, s) {
            
    const timeAudio = document.querySelector(".time-audio");
    const time = document.createElement("P");
    while(timeAudio.firstChild) {
        timeAudio.removeChild(timeAudio.firstChild);
    }
    if(s < 10) {
        time.textContent = `0${m}:0${s}`;
    } else {
        time.textContent = `0${m}:${s}`;
    }
    timeAudio.appendChild(time);
}

// hace el calculo del teimpo de la cancion
function countTime() { 
    let ct = `${audio.currentTime}`;
    let ctArray = ct.split(".");
    let seg = `${ctArray[0] / 60}`;
    let arrayM = seg.split(".");
    let m = arrayM[0];
    let s = ctArray[0];
    let se = 60;

    for(let i = 1; i < 100; i++) {
        if(m == i) {
            s = ctArray[0] - se;
        } else {
            se+=60;
        }
    }

    timeSong(m, s);
}