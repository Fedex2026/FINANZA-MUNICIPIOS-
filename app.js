let datos = JSON.parse(localStorage.getItem("gruas")) || [];

let tipoSeleccionado = "efectivo";
let corralonSeleccionado = "no";
let gratisSeleccionado = "no";

function dinero(n) {
  return "$" + Number(n || 0).toLocaleString("es-MX");
}

function setTipo(tipo) {
  tipoSeleccionado = tipo;
  document.getElementById("tipo").value = tipo;

  document.getElementById("btnEfectivo").classList.remove("activo");
  document.getElementById("btnVale").classList.remove("activo");
  document.getElementById("btnTransferencia").classList.remove("activo");

  if (tipo === "efectivo") {
    document.getElementById("btnEfectivo").classList.add("activo");
    document.getElementById("valePanel").style.display = "none";
    document.getElementById("aseguradora").value = "";
  }

  if (tipo === "vale") {
    document.getElementById("btnVale").classList.add("activo");
    document.getElementById("valePanel").style.display = "block";
  }

  if (tipo === "transferencia") {
    document.getElementById("btnTransferencia").classList.add("activo");
    document.getElementById("valePanel").style.display = "none";
    document.getElementById("aseguradora").value = "";
  }

  actualizarPreview();
}

function setCorralon(tipo) {
  corralonSeleccionado = tipo;
  document.getElementById("corralon").value = tipo;

  document.getElementById("corNo").classList.remove("activo");
  document.getElementById("corMP").classList.remove("activo");
  document.getElementById("corJC").classList.remove("activo");
  document.getElementById("corGarantia").classList.remove("activo");

  if (tipo === "no") document.getElementById("corNo").classList.add("activo");
  if (tipo === "mp") document.getElementById("corMP").classList.add("activo");
  if (tipo === "jc") document.getElementById("corJC").classList.add("activo");
  if (tipo === "garantia") document.getElementById("corGarantia").classList.add("activo");
}

function setGratis(valor) {
  gratisSeleccionado = valor;
  document.getElementById("gratis").value = valor;

  document.getElementById("gratisSi").classList.remove("activo");
  document.getElementById("gratisNo").classList.remove("activo");

  if (valor === "si") document.getElementById("gratisSi").classList.add("activo");
  if (valor === "no") document.getElementById("gratisNo").classList.add("activo");
}

function guardar() {
  const registro = {
    fecha: document.getElementById("fecha").value,
    marca: document.getElementById("marca").value.trim().toUpperCase(),
    submarca: document.getElementById("submarca").value.trim().toUpperCase(),
    tipo: document.getElementById("tipo").value || tipoSeleccionado,
    aseguradora: document.getElementById("aseguradora").value,
    monto: Number(document.getElementById("monto").value) || 0,
    ajustador: Number(document.getElementById("ajustador").value) || 0,
    policia: Number(document.getElementById("policia").value) || 0,
    corralon: document.getElementById("corralon").value || corralonSeleccionado,
    inventario: document.getElementById("inventario").value.trim().toUpperCase(),
    gratis: document.getElementById("gratis").value || gratisSeleccionado,
    hora: new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  registro.gastos = registro.ajustador + registro.policia;
  registro.ganancia = registro.monto - registro.gastos;

  datos.unshift(registro);
  localStorage.setItem("gruas", JSON.stringify(datos));

  limpiarFormulario();
  mostrar();
}

function mostrar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  datos.forEach((d, index) => {
    lista.innerHTML += `
      <div class="card">
        <div class="carIcon">🚗</div>

        <div class="cardInfo">
          <small>${d.hora || "00:00"} · ${d.fecha || "Sin fecha"}</small>
          <b>${d.marca || "SIN MARCA"}</b>
          <span>${d.submarca || "Sin submarca"}</span>
          <span>${d.aseguradora || textoCorralon(d.corralon)}</span>
        </div>

        <div class="cardRight">
          <span class="badge ${d.tipo}">${textoTipo(d.tipo)}</span>
          <b>${dinero(d.monto)}</b>
          <small>Ganancia: ${dinero(d.ganancia)}</small>
        </div>

        <button class="deleteBtn" onclick="eliminar(${index})">Eliminar</button>
      </div>
    `;
  });

  resumen();
}

function resumen() {
  let totalEfectivo = 0;
  let totalVale = 0;
  let totalTransferencia = 0;
  let totalGastos = 0;
  let gananciaTotal = 0;

  datos.forEach(d => {
    if (d.tipo === "efectivo") totalEfectivo += d.monto;
    if (d.tipo === "vale") totalVale += d.monto;
    if (d.tipo === "transferencia") totalTransferencia += d.monto;

    totalGastos += d.gastos;
    gananciaTotal += d.ganancia;
  });

  document.getElementById("totalEfectivo").innerText = dinero(totalEfectivo);
  document.getElementById("totalVale").innerText = dinero(totalVale);
  document.getElementById("totalTransferencia").innerText = dinero(totalTransferencia);
  document.getElementById("totalGastos").innerText = dinero(totalGastos);
  document.getElementById("gananciaTotal").innerText = dinero(gananciaTotal);
}

function actualizarPreview() {
  const ingreso = Number(document.getElementById("monto")?.value) || 0;
  const ajustador = Number(document.getElementById("ajustador")?.value) || 0;
  const policia = Number(document.getElementById("policia")?.value) || 0;
  const gastos = ajustador + policia;
  const ganancia = ingreso - gastos;

  document.getElementById("previewIngreso").innerText = dinero(ingreso);
  document.getElementById("previewGastos").innerText = dinero(gastos);
  document.getElementById("previewGanancia").innerText = dinero(ganancia);
  document.getElementById("previewTipo").innerText = textoTipo(tipoSeleccionado);
}

function textoTipo(tipo) {
  if (tipo === "efectivo") return "EFECTIVO";
  if (tipo === "vale") return "VALE";
  if (tipo === "transferencia") return "TRANSFERENCIA";
  return tipo;
}

function textoCorralon(corralon) {
  if (corralon === "no") return "NO CORRALÓN";
  if (corralon === "mp") return "MP";
  if (corralon === "jc") return "JC";
  if (corralon === "garantia") return "GARANTÍA DE PAGO";
  return corralon;
}

function eliminar(index) {
  datos.splice(index, 1);
  localStorage.setItem("gruas", JSON.stringify(datos));
  mostrar();
}

function limpiarFormulario() {
  document.getElementById("fecha").value = "";
  document.getElementById("marca").value = "";
  document.getElementById("submarca").value = "";
  document.getElementById("aseguradora").value = "";
  document.getElementById("monto").value = "";
  document.getElementById("ajustador").value = "";
  document.getElementById("policia").value = "";
  document.getElementById("inventario").value = "";

  setTipo("efectivo");
  setCorralon("no");
  setGratis("no");
  actualizarPreview();
}

["monto", "ajustador", "policia"].forEach(id => {
  document.getElementById(id).addEventListener("input", actualizarPreview);
});

document.getElementById("fechaHoy").innerText =
  new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

setTipo("efectivo");
setCorralon("no");
setGratis("no");
actualizarPreview();
mostrar();
