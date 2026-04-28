const juegoInicial = {
    puntosTot: 0,
    puntosPorClick: 1,
    puntosPorSeg: 0,
    mejoras: {
        Fuego: {costo: 10, clicks: 0.5, lvl: 1, piso:10, cant: 0},
        Bestia: {costo: 100, clicks: 2, lvl: 1, piso:10, cant: 0}
    }
};

let juego = structuredClone(juegoInicial);

const puntos = document.getElementById("puntos");
const btn = document.getElementById("boton");
renderUpgrades();
render();

btn.addEventListener("click", ()=>{
    juego.puntosTot += juego.puntosPorClick;
    render();
});

setInterval(() => {
    juego.puntosTot += juego.puntosPorSeg;
    render();
},1000);

function comprarMejora(nombre){
    const mejora = juego.mejoras[nombre];

    if (juego.puntosTot >= mejora.costo){
        juego.puntosTot -= mejora.costo;
        juego.puntosPorSeg += mejora.clicks;
        mejora.cant++;
        mejora.clicks += Math.floor(mejora.cant / 10);
        mejora.costo = Math.floor(mejora.costo * 1.25);
        if (mejora.cant >= mejora.piso){
            mejora.lvl++;
            mejora.clicks *= 2;
            mejora.piso *= 2;
        }
        renderUpgrades();
        render();
    }
}

function renderUpgrades() {
  const container = document.getElementById("mejoras");
  container.innerHTML = "";

  for (let key in juego.mejoras) {
    const u = juego.mejoras[key];

    //const btn = document.createElement("button");
    //btn.textContent = `${key} (Nivel ${u.lvl}) Costo: ${u.costo} Cantidad: ${u.cant} Punto por mejora: ${u.clicks}`;
    container.insertAdjacentHTML('beforeend',`
        <div class="mejora" data-key="${key}">
            <h4>${key}</h4>
            <p>(Nivel ${u.lvl})</p>
            <p>Costo: ${u.costo} Cantidad: ${u.cant} Punto por mejora: ${u.clicks}</p>
        </div>
    `);
  }
}
document.getElementById("mejoras").addEventListener("click", (e) => {
  const mejoraDiv = e.target.closest(".mejora");
  if (!mejoraDiv) return;

  const key = mejoraDiv.dataset.key;
  comprarMejora(key);
});

function render(){
    puntos.textContent = `${juego.puntosTot} puntos ${juego.puntosPorSeg} puntos por segundo`;
}

function resetGame() {
  const confirmReset = confirm("¿Seguro que querés borrar todo el progreso?");
  if (!confirmReset) return;

  localStorage.removeItem("clickerSave");

  juego = structuredClone(juegoInicial);

  render();
  renderUpgrades();
}
document.getElementById("resetBtn").addEventListener("click", resetGame);

setInterval(() => {
  localStorage.setItem("clickerSave", JSON.stringify(juego));
}, 1000);

window.onload = () => {
  const save = localStorage.getItem("clickerSave");

  if (save) {
    const parsed = JSON.parse(save);
    juego = Object.assign(structuredClone(juegoInicial), parsed);
  }
  render();
  renderUpgrades();
};
