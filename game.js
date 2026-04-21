const juego = {
    puntosTot: 0,
    puntosPorClick: 1,
    puntosPorSeg: 0,
    mejoras: {
        autoClick: {costo: 10, clicks: 1, lvl: 1}
    }
}

const puntos = document.getElementById("puntos");
const btn = document.getElementById("boton");

btn.addEventListener("click", ()=>{
    juego.puntosTot += juego.puntosPorClick;
    puntos.textContent = `${juego.puntosTot} puntos`;
});

function comprarMejora(nombre){
    const mejora = juego.mejoras[nombre]
}