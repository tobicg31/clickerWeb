const juegoInicial = {
    puntosTot: 0,
    puntosPorClick: 1,
    puntosPorSeg: 0,
    /*
    mejoras: {
        Fuego: {costo: 10, ppS: 0.5, lvl: 1, piso:10, cant: 0, esSeg:1},
        Bestia: {costo: 100, ppS: 2, lvl: 1, piso:10, cant: 0, esSeg:1},
        MateriaGris: {costo: 10, clicks: 1, lvl:1, piso:10, cant: 0, esSeg:0}
    }*/
    mejoras: {
      Fuego: {costo: 15, ppS: 0.2, lvl:1, piso:10, cant:0, esSeg:1},
      Bestia: {costo: 60, ppS: 0.5, lvl:1, piso:10, cant:0, esSeg:1},
      MateriaGris: {costo: 250, ppS: 1, lvl:1, piso:10, cant:0, esSeg:1},
      Ripjaws: {costo: 900, ppS: 3, lvl:1, piso:10, cant:0, esSeg:1},
      CuatroBrazos: {costo: 3500, ppS: 8, lvl:1, piso:10, cant:0, esSeg:1},
      UltraT: {costo: 12000, ppS: 20, lvl:1, piso:10, cant:0, esSeg:1},
      Insectoide: {costo: 45000, ppS: 60, lvl:1, piso:10, cant:0, esSeg:1},
      Diamante: {costo: 160000, ppS: 150, lvl:1, piso:10, cant:0, esSeg:1},
      Fantasmatico: {costo: 600000, ppS: 400, lvl:1, piso:10, cant:0, esSeg:1},
      XLR8: {costo: 2000000, ppS: 1200, lvl:1, piso:10, cant:0, esSeg:1},

      BrazoTetramand: {costo: 20, clicks: 1, lvl:1, piso:10, cant:0, esSeg:0},
      VistaGalvan: {costo: 120, clicks: 3, lvl:1, piso:10, cant:0, esSeg:0},
      ExotrajeVulpimancer: {costo: 700, clicks: 8, lvl:1, piso:10, cant:0, esSeg:0},
      NucleoCinetico: {costo: 4000, clicks: 20, lvl:1, piso:10, cant:0, esSeg:0},
      OverdriveOmnitrix: {costo: 25000, clicks: 60, lvl:1, piso:10, cant:0, esSeg:0}
    }
};

let juego = structuredClone(juegoInicial);

const puntos = document.getElementById("puntos");
const ppC = document.getElementById("ppC")
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

        if (mejora.esSeg){
          juego.puntosPorSeg += mejora.ppS;
        }else{
          juego.puntosPorClick += mejora.clicks;
        }

        mejora.cant++;
        mejora.clicks += Math.floor(mejora.cant / 10);
        mejora.costo = Math.floor(mejora.costo * 1.25);
        if (mejora.cant >= mejora.piso){
          mejora.lvl++;
          if (mejora.esSeg){
            mejora.ppS *= 2;
          }else{
            mejora.clicks *= 2;
          }
          mejora.piso += 10;
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
    if (u.esSeg){
    container.insertAdjacentHTML('beforeend',`
        <div class="mejora" data-key="${key}">
            <h4>${key}</h4>
            <p>(Nivel ${u.lvl})</p>
            <p>Costo: ${u.costo} Cantidad: ${u.cant} Punto por mejora: ${u.ppS}</p>
        </div>
    `);
    }else{
      container.insertAdjacentHTML('beforeend',`
        <div class="mejora" data-key="${key}">
            <h4>${key}</h4>
            <p>(Nivel ${u.lvl})</p>
            <p>Costo: ${u.costo} Cantidad: ${u.cant} Punto por mejora: ${u.clicks}</p>
        </div>
    `)
      }
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
    ppC.textContent = `${juego.puntosPorClick} puntos p click`;
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
