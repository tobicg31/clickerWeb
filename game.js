const juego = {
    puntosTot: 0,
    puntosPorClick: 1,
    puntosPorSeg: 0,
    mejoras: {
        autoClick: {costo: 10, clicks: 0.5, lvl: 1, piso:10, cant: 0}
    }
}

const puntos = document.getElementById("puntos");
const btn = document.getElementById("boton");
renderUpgrades();

btn.addEventListener("click", ()=>{
    juego.puntosTot += juego.puntosPorClick;
    puntos.textContent = `${juego.puntosTot} puntos`;
});

setInterval(() => {
    juego.puntosTot += juego.puntosPorSeg;
    puntos.textContent = `${juego.puntosTot} puntos`;
},1000);

function comprarMejora(nombre){
    const mejora = juego.mejoras[nombre];

    if (juego.puntosTot >= mejora.costo){
        juego.puntosTot -= mejora.costo;
        juego.puntosPorSeg += mejora.clicks;
        mejora.cant++;
        mejora.costo = Math.floor(mejora.costo * 1.5);
        if (mejora.cant >= mejora.piso){
            mejora.lvl++;
            mejora.clicks *= 2;
            mejora.piso *= 2;
        }
        renderUpgrades();
        puntos.textContent = `${juego.puntosTot} puntos`;
    }
}

function renderUpgrades() {
  const container = document.getElementById("mejoras");
  container.innerHTML = "";

  for (let key in juego.mejoras) {
    const u = juego.mejoras[key];

    const btn = document.createElement("button");
    btn.textContent = `${key} (Nivel ${u.lvl}) Costo: ${u.costo} Cantidad: ${u.cant} Punto por mejora: ${u.clicks}`;
    btn.onclick = () => comprarMejora(key);

    container.appendChild(btn);
  }
}

setInterval(() => {
  localStorage.setItem("clickerSave", JSON.stringify(juego));
}, 1000);

window.onload = () => {
  const save = localStorage.getItem("clickerSave");
  if (save) Object.assign(juego, JSON.parse(save));
  puntos.textContent = `${juego.puntosTot} puntos`;
  renderUpgrades();
};