const id = resultado['duelo'];
const jugadorduelo1 = resultado['infoduelo']['jugador1']['nombreUsuario'];
const jugadorduelo2 = resultado['infoduelo']['jugador2']['nombreUsuario'];
let soyjugador1 = false;


// verifica si los ususuarios son los correctos para jugar el duelo 
if (localStorage.getItem('pocketMonstersUsuario') != jugadorduelo1 && localStorage.getItem('pocketMonstersUsuario') != jugadorduelo2) {
    window.location.href = '/denegarduelo';
}

// verificar si el ususario es el jugador 1 
if (jugadorduelo1 == localStorage.getItem('pocketMonstersUsuario')){
    soyjugador1 = true;
}

document.addEventListener('DOMContentLoaded', ()=> {
    
    let intervalId;

    async function actualizardatos (){
        fetch(`http://localhost:3000/actualizardatos/duelo?numeroDuelo=${id}`)
        .then(response => response.json())
        .then (result => {
            // Verifica si el turno es par y si usuario es el jugador1
            if (result['turnos'] % 2 === 0 && soyjugador1) {
                let botonAtacar = document.getElementById('botonAtacar');
                botonAtacar.disabled = false;
                botonAtacar.classList.remove('disabled-button');
                botonAtacar.innerHTML = "Atacar";
            } 
            // Verifica si el turno es impar y si el usuario es el jugador2
            else if (result['turnos'] % 2 !== 0 && !soyjugador1) {
                let botonAtacar = document.getElementById('botonAtacar');
                botonAtacar.disabled = false;
                botonAtacar.classList.remove('disabled-button');
                botonAtacar.innerHTML = "Atacar";
            } 
            // Deshabilita el botón mientras es el turno del otro jugador
            else {
                let botonAtacar = document.getElementById('botonAtacar');
                botonAtacar.disabled = true;
                botonAtacar.classList.add('disabled-button');
                botonAtacar.innerHTML = "Turno de tu rival";
            }
    
            for (let i = 0; i < 6; i++) {
                document.getElementById(`hpPokemonEquipo1${i}`).innerHTML = result["jugador1"]['equipo'][i]['HP'].toString();
                document.getElementById(`hpPokemonEquipo2${i}`).innerHTML = result["jugador2"]['equipo'][i]['HP'].toString();
                if (result["jugador1"]['equipo'][i]['HP'] == 0) {
                    let radioequipo1 = document.getElementById(`inputEquipo1${i}`);
                    radioequipo1.disabled = true;
                    let labellabelPokemonEquipo1 = document.getElementById(`labelPokemonEquipo1${i}`);
                    labellabelPokemonEquipo1.style.textDecoration = 'line-through'; 
                }
                if (result["jugador2"]['equipo'][i]['HP'] == 0) {
                    let radioequipo2 = document.getElementById(`inputEquipo2${i}`);
                    radioequipo2.disabled = true;
                    let labellabelPokemonEquipo2 = document.getElementById(`labelPokemonEquipo2${i}`);
                    labellabelPokemonEquipo2.style.textDecoration = 'line-through';                   
                }
            }
    
            if (result['resultados']['estaterminado']) {
                clearInterval(intervalId);
                let mostrarGanador = "";
                if (localStorage.getItem('pocketMonstersUsuario') == result['resultados']['ganador']){
                    mostrarGanador = `<h1>Ganador:</h1><h1>${result['resultados']['ganador']}</h1><img src="../pikaFeliz.png" alt="pikaFeliz.png" style="height: 200px; width: 200px;">`;
                }
                else {
                    mostrarGanador = `<h1>Ganador:</h1><h1>${result['resultados']['ganador']}</h1><img src="../pika.png" alt="pikaFeliz.png" style="height: 200px; width: 200px;">`;
                }
                document.getElementById('mostrarganadorOPerdedor').innerHTML = mostrarGanador;
                let botonAtacar = document.getElementById('botonAtacar');
                botonAtacar.disabled = true;
                botonAtacar.classList.add('disabled-button');
                botonAtacar.innerHTML = "Duelo Finalizado";
            }
            console.log('Conecando');
            
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    intervalId = setInterval(actualizardatos, 500);
    
    
    const botonAtacar = document.getElementById("botonAtacar");
    botonAtacar.addEventListener("click", () => {
        const pokemonJugador1 = document.querySelector('input[name="team1"]:checked');
        const pokemonJugador2 = document.querySelector('input[name="team2"]:checked');

        if (pokemonJugador1 && pokemonJugador2) {
            console.log(pokemonJugador1.value);
            console.log("Jugador 2:", pokemonJugador2.value);
            let url = `http://localhost:3000/duelo/calculosduelo?id=${id}&jugador1=${pokemonJugador1.value}&jugador2=${pokemonJugador2.value}`;
            fetch(url, {method: 'POST'})
            .catch(error => {
                console.error('ERROR AL ENVIAR EL ATAQUE A LA BASE DE DATOS');
            });
        } else {
            console.log("No selecciono los 2 opciones");
        }
        for (let i = 0; i < 6; i++) {
            document.getElementById(`inputEquipo1${i}`).checked = false;
            document.getElementById(`inputEquipo2${i}`).checked = false;
        }

    });

});