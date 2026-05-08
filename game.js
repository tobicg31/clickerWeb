const juegoInicial = {
    puntosTot: 0,
    puntosPorClick: 100,
    puntosPorSeg: 0,
    /*
    mejoras: {
        Fuego: {costo: 10, ppS: 0.5, lvl: 1, piso:10, cant: 0, esSeg:1},
        Bestia: {costo: 100, ppS: 2, lvl: 1, piso:10, cant: 0, esSeg:1},
        MateriaGris: {costo: 10, clicks: 1, lvl:1, piso:10, cant: 0, esSeg:0}
    }*/
    mejoras: {
      Fuego: {costo: 15, ppS: 20, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      Bestia: {costo: 60, ppS: 50, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      MateriaGris: {costo: 250, ppS: 100, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      Ripjaws: {costo: 900, ppS: 300, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      CuatroBrazos: {costo: 3500, ppS: 800, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      UltraT: {costo: 12000, ppS: 2000, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      Insectoide: {costo: 45000, ppS: 6000, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      Diamante: {costo: 160000, ppS: 15000, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      Fantasmatico: {costo: 600000, ppS: 40000, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},
      XLR8: {costo: 2000000, ppS: 120000, lvl:1, piso:10, cant:0, esSeg:1, descubierta:false},

      BrazoTetramand: {costo: 20, clicks: 100, lvl:1, piso:10, cant:0, esSeg:0, descubierta:false},
      VistaGalvan: {costo: 120, clicks: 300, lvl:1, piso:10, cant:0, esSeg:0, descubierta:false},
      ExotrajeVulpimancer: {costo: 700, clicks: 800, lvl:1, piso:10, cant:0, esSeg:0, descubierta:false},
      NucleoCinetico: {costo: 4000, clicks: 2000, lvl:1, piso:10, cant:0, esSeg:0, descubierta:false},
      OverdriveOmnitrix: {costo: 25000, clicks: 6000, lvl:1, piso:10, cant:0, esSeg:0, descubierta:false}
    }
};

let juego = structuredClone(juegoInicial);
const ESCALA = 100;

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
    renderUpgrades();
},1000);

function comprarMejora(nombre){
    const mejora = juego.mejoras[nombre];

    if (juego.puntosTot >= mejora.costo * ESCALA){
        juego.puntosTot -= mejora.costo * ESCALA;

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

    // Descubrir para siempre
    if (!u.descubierta && juego.puntosTot * 10 >= u.costo * 7 * ESCALA) {
      u.descubierta = true;
    }

    let clase = "mejora bloqueada";

    if (u.descubierta) {
      if (juego.puntosTot >= u.costo * ESCALA) {
        clase = "mejora alcanza";
      } else {
        clase = "mejora no-alcanza";
      }
    }

    let textoPoder = u.esSeg
      ? `Punto por mejora: ${(u.ppS/ESCALA).toFixed(1)} PPS`
      : `Punto por mejora: ${u.clicks} Click`;

    container.insertAdjacentHTML('beforeend',`
      <div class="${clase}" data-key="${key}">
          <h4>${key}</h4>
          <p>(Nivel ${u.lvl})</p>
          <p>Costo: ${u.costo}</p>
          <p>${textoPoder}</p>
          <p>Cantidad: ${u.cant}</p>
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
    puntos.textContent =  `${(juego.puntosTot/ESCALA).toFixed(1)} puntos ${(juego.puntosPorSeg/ESCALA).toFixed(1)} puntos por segundo`;
    ppC.textContent = `${juego.puntosPorClick/ESCALA.toFixed(1)} puntos p click`;
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
