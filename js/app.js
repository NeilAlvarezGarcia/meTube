// Variables
const songs = document.querySelectorAll(".song");
const body = document.querySelector("body");
let audio;
let anterior = 0;
let segundos = 0;
let minutos = 0 ;

// listener
eventListener();
function eventListener() {
    // Recorrer el arreglo de las canciones;
    songs.forEach((song, key) => {
        // Listener para una canción
        song.addEventListener("click", () => {
            const text = song.children[1].textContent;
            
            // Muestra la cancion a reproducir en el html
            showDiv(key, text);
        });
    });
    
    // Revisa el tiempo de la canción
    setInterval(() => {
        if(audio) {
            // Remueve el html de la canción si esta acabó
            Finish();
    
            // Muestra el tiempo de la canción
            showTime();
        }
    }, 50);

    
    // Calcula y muestra en pantalla el tiempo de la canción
    setInterval(() => {
        if(audio) {
            if(audio.currentTime !== anterior) {
                segundos++;
                if(segundos > 59) {
                    segundos = 0;
                    minutos++;
                }
                
                const timeAudio = document.querySelector(".time-audio");
                const time = document.createElement("P");
                while(timeAudio.firstChild) {
                    timeAudio.removeChild(timeAudio.firstChild);
                }
                if(segundos < 10) {
                    time.textContent = `0${minutos}:0${segundos}`
                } else {
                    time.textContent = `0${minutos}:${segundos}`
                }
                timeAudio.appendChild(time)
            }
            anterior = audio.currentTime;
        }
    }, 1000);
}

// Muestra el html con la canción a reproducir
function showDiv(key, texto) {
    if(!audio) {
        // Crea el nuevo audio
        audio = new Audio(`songs/${key + 1}.mp3`);
        audio.play();

        // Variables, classes y acciones para el div de la canción
        const div = document.createElement("DIV");
        div.classList.add("music", "flex");
        setTimeout(() => {
            div.style.transform = "scale(1)";
        }, 100);
    
        const content = document.createElement("DIV");
        content.classList.add("content", "bg-white", "shadow");
    
        const container = document.createElement("DIV");
        container.classList.add("music__container", "flex");
        container.style.backgroundImage = `url(img/${key + 1}.jpg)`;
    
        const h2 = document.createElement("H2");
        h2.classList.add("shadow");
        h2.textContent = `${texto}`;
    
        const functions = document.createElement("DIV");
        functions.classList.add("funciones", "bg-white", "flex");
        
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
            <div class="duration">
                <div class="time"></div>
            </div>
        `;
        
        const volume1 =  document.createElement("I");
        volume1.classList.add("bx", "bxs-volume-full", "full");
        const volume2 =  document.createElement("I");
        volume2.classList.add("bx", "bxs-volume-low", "hide", "low");
        const volume3 =  document.createElement("I");
        volume3.classList.add("bx", "bxs-volume-mute", "hide", "mute");
        
        const input = document.createElement("INPUT");
        input.classList.add("changeVolume");
        input.setAttribute("type", "range");
        input.setAttribute("min", "0");
        input.setAttribute("max", "1");
        input.setAttribute("step", "0.01");
        input.value = "1"; 
        
        const divInput = document.createElement("DIV");
        divInput.classList.add("input-container", "hide", "shadow", "bg-white"); 
        
        const divDownload = document.createElement("DIV");
        divDownload.classList.add("descarga", "bg-white", "flex");
        divDownload.innerHTML = `
            <a href="songs/${key + 1}.mp3" download>
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

        // Listeners para play y pause
        iconPlay.onclick = () => {
            audio.play();
            iconPlay.classList.add("hide");
            iconPause.classList.remove("hide");
        }
        iconPause.onclick = stopSong;
        // Listener para el volumen
        volume1.onclick = onVolume;
        volume2.onclick = onVolume;  
        volume3.onclick = onVolume; 
        // Listener para cerrar el div con la canción
        remove.onclick = elimianrMusica;
        
        // Agregar todo el div al html
        divInput.appendChild(input);
        controls.appendChild(volume1);
        controls.appendChild(volume2);
        controls.appendChild(volume3);
        controls.appendChild(divInput);
        container.appendChild(h2);
        functions.appendChild(iconPlay);
        functions.appendChild(iconPause);
        container.appendChild(functions);
        container.appendChild(controls);
        container.appendChild(divDownload);
        content.appendChild(container);
        div.appendChild(content)
        div.appendChild(remove);
        body.appendChild(div);

    

    }
}

// Muestra el tiempo de la canción
function showTime() {
    // Muestra el width de la duración de la canción
    let divDuration = Number(document.querySelector(".duration").clientWidth);
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
        segundos = 0;
        anterior = 0;
        minutos = 0;
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
            segundos = 0;
            anterior = 0;
            minutos = 0;
        }, 100)
        audio.pause();
        audio = "";
    }

}
