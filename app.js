let datos = JSON.parse(localStorage.getItem("gruas")) || [];

let tipoSeleccionado = "efectivo";

function dinero(n) {
  return "$" + Number(n || 0).toLocaleString("es-MX");
}

function textoVales(n) {
  return n + " vales";
}

function setTipo(tipo) {
  tipoSeleccionado = tipo;
  document.getElementById("tipo").value = tipo;

  const label = document.getElementById("labelMonto");
  const monto = document.getElementById("monto");

  document.getElementById("btnEfectivo").classList.remove("activo");
  document.getElementById("btnVale").classList.remove("activo");
  document.getElementById("btnTransferencia").classList.remove("activo");

  if (tipo === "efectivo") {
    document.getElementById("btnEfectivo").classList.add("activo");
    label.innerText = "Monto recibido";
    monto.placeholder = "Ej. 1500";
  }

  if (tipo === "vale") {
    document.getElementById("btnVale").classList.add("activo");
    label.innerText = "Número de vales";
    monto.placeholder = "Ej. 3";
  }

  if (tipo === "transferencia") {
    document.getElementById("btnTransferencia").classList.add("activo");
    label.innerText = "Monto transferencia";
    monto.placeholder = "Ej. 1500";
  }
}

function guardar() {

  const tipo = document.getElementById("tipo").value;
  const cantidad = Number(document.getElementById("monto").value) || 0;

  const registro = {
    fecha: document.getElementById("fecha").value,
    marca: document.getElementById("marca").value,
    submarca: document.getElementById("submarca").value,
    tipo: tipo,
    monto: tipo === "vale" ? 0 : cantidad,
    numeroVales: tipo === "vale" ? cantidad : 0
  };

  datos.unshift(registro);
  localStorage.setItem("gruas", JSON.stringify(datos));

  mostrar();
}

function mostrar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  datos.forEach((d) => {

    const cantidad = d.tipo === "vale"
      ? textoVales(d.numeroVales)
      : dinero(d.monto);

    lista.innerHTML += `
      <div class="card">
        <b>${d.marca}</b>
        <span>${d.submarca}</span>
        <span>${cantidad}</span>
      </div>
    `;
  });
}

function enviarWhatsApp(tipo) {

  let totalEfectivo = 0;
  let totalVale = 0;
  let totalTransferencia = 0;

  datos.forEach(d => {
    if (d.tipo === "efectivo") totalEfectivo += d.monto;
    if (d.tipo === "vale") totalVale += d.numeroVales;
    if (d.tipo === "transferencia") totalTransferencia += d.monto;
  });

  let mensaje = "*REPORTE*\n\n";

  mensaje += "Efectivo: " + dinero(totalEfectivo) + "\n";
  mensaje += "Vales: " + textoVales(totalVale) + "\n";
  mensaje += "🔴 Transferencia: " + dinero(totalTransferencia) + "\n";

  window.open("https://wa.me/?text=" + encodeURIComponent(mensaje));
}

function abrirMenu() {
  document.getElementById("menuLateral").classList.add("activo");
}

function cerrarMenu() {
  document.getElementById("menuLateral").classList.remove("activo");
}

function irA() {}

mostrar();

/* PWA */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
