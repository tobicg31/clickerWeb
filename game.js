const juego = {
    puntosTot: 0,
    puntosPorClick: 1,
    puntosPorSeg: 0
}

const puntos = document.getElementById("puntos");
const btn = document.getElementById("boton");

btn.addEventListener("click", ()=>{
    juego.puntosTot += juego.puntosPorClick;
    puntos.textContent = `${juego.puntosTot} puntos`;
});