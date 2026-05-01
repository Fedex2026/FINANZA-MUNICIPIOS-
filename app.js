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

  const pagoMPJCPanel = document.getElementById("pagoMPJCPanel");
  const label = document.getElementById("labelMPJC");
  const titulo = document.getElementById("tituloMPJC");

  if (tipo === "no") {
    document.getElementById("corNo").classList.add("activo");
    pagoMPJCPanel.style.display = "none";
    document.getElementById("pagoMPJC").value = "";
  }

  if (tipo === "mp") {
    document.getElementById("corMP").classList.add("activo");
    pagoMPJCPanel.style.display = "block";
    titulo.innerText = "PAGO A MP";
    label.innerText = "¿Cuánto se le dio al MP?";
  }

  if (tipo === "jc") {
    document.getElementById("corJC").classList.add("activo");
    pagoMPJCPanel.style.display = "block";
    titulo.innerText = "PAGO A JC";
    label.innerText = "¿Cuánto se le dio al JC?";
  }

  if (tipo === "garantia") {
    document.getElementById("corGarantia").classList.add("activo");
    pagoMPJCPanel.style.display = "none";
    document.getElementById("pagoMPJC").value = "";
  }

  actualizarPreview();
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
    pagoMPJC: Number(document.getElementById("pagoMPJC").value) || 0,
    gasolina: Number(document.getElementById("gasolina").value) || 0,
    diesel: Number(document.getElementById("diesel").value) || 0,
    otros: Number(document.getElementById("otros").value) || 0,
    gratis: document.getElementById("gratis").value || gratisSeleccionado,
    hora: new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  registro.gastos =
    registro.ajustador +
    registro.policia +
    registro.pagoMPJC +
    registro.gasolina +
    registro.diesel +
    registro.otros;

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
          <span>Inventario: ${d.inventario || "No aplica"}</span>
          <span>Pago MP/JC: ${dinero(d.pagoMPJC)}</span>
          <span>Gasolina: ${dinero(d.gasolina)} · Diésel: ${dinero(d.diesel)}</span>
          <span>Otros: ${dinero(d.otros)}</span>
          <span>Gastos totales: ${dinero(d.gastos)}</span>
        </div>

        <div class="cardRight">
          <span class="badge ${d.tipo}">${textoTipo(d.tipo)}</span>
          <b>${dinero(d.monto)}</b>
          <small>Total: ${dinero(d.ganancia)}</small>
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
  const pagoMPJC = Number(document.getElementById("pagoMPJC")?.value) || 0;
  const gasolina = Number(document.getElementById("gasolina")?.value) || 0;
  const diesel = Number(document.getElementById("diesel")?.value) || 0;
  const otros = Number(document.getElementById("otros")?.value) || 0;

  const gastos = ajustador + policia + pagoMPJC + gasolina + diesel + otros;
  const ganancia = ingreso - gastos;

  document.getElementById("previewIngreso").innerText = dinero(ingreso);
  document.getElementById("previewGastos").innerText = dinero(gastos);
  document.getElementById("previewGanancia").innerText = dinero(ganancia);
  document.getElementById("previewTipo").innerText = textoTipo(tipoSeleccionado);
}

function limpiarGastosExtra() {
  document.getElementById("pagoMPJC").value = "";
  document.getElementById("gasolina").value = "";
  document.getElementById("diesel").value = "";
  document.getElementById("otros").value = "";
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
  return corralon || "NO CORRALÓN";
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

  limpiarGastosExtra();

  setTipo("efectivo");
  setCorralon("no");
  setGratis("no");
  actualizarPreview();
}

function abrirMenu() {
  document.getElementById("menuLateral").classList.add("activo");
}

function cerrarMenu() {
  document.getElementById("menuLateral").classList.remove("activo");
}

function irA(seccion) {
  cerrarMenu();

  if (seccion === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (seccion === "agregar") {
    document.querySelector(".agregarPanel").scrollIntoView({ behavior: "smooth" });
  }

  if (seccion === "resumen") {
    document.querySelector(".resumenPanel").scrollIntoView({ behavior: "smooth" });
  }

  if (seccion === "registros") {
    document.querySelector(".registrosPanel").scrollIntoView({ behavior: "smooth" });
  }
}

function fechaLocalISO(fecha = new Date()) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inicioSemana(fecha = new Date()) {
  const f = new Date(fecha);
  const dia = f.getDay();
  const diferencia = dia === 0 ? 6 : dia - 1;
  f.setDate(f.getDate() - diferencia);
  return fechaLocalISO(f);
}

function enviarWhatsApp(tipoReporte) {
  const hoy = fechaLocalISO();
  const inicio = inicioSemana();

  const registrosFiltrados = datos.filter(r => {
    if (!r.fecha) return false;

    if (tipoReporte === "dia") return r.fecha === hoy;
    if (tipoReporte === "semana") return r.fecha >= inicio && r.fecha <= hoy;

    return false;
  });

  if (registrosFiltrados.length === 0) {
    alert("No hay registros para enviar.");
    return;
  }

  let ingresoTotal = 0;
  let descuentoPagos = 0;
  let totalFinal = 0;

  let totalAjustador = 0;
  let totalPolicia = 0;
  let totalMPJC = 0;
  let totalGasolina = 0;
  let totalDiesel = 0;
  let totalOtros = 0;

  let mensaje = tipoReporte === "dia"
    ? `*REPORTE DEL DÍA*\nFecha: ${hoy}\n\n`
    : `*REPORTE SEMANAL*\nDel ${inicio} al ${hoy}\n\n`;

  registrosFiltrados.forEach((r, i) => {
    const ingreso = Number(r.monto) || 0;
    const ajustador = Number(r.ajustador) || 0;
    const policia = Number(r.policia) || 0;
    const mpjc = Number(r.pagoMPJC) || 0;
    const gasolina = Number(r.gasolina) || 0;
    const diesel = Number(r.diesel) || 0;
    const otros = Number(r.otros) || 0;

    const gastosRegistro = ajustador + policia + mpjc + gasolina + diesel + otros;
    const totalRegistro = ingreso - gastosRegistro;

    ingresoTotal += ingreso;
    descuentoPagos += gastosRegistro;
    totalFinal += totalRegistro;

    totalAjustador += ajustador;
    totalPolicia += policia;
    totalMPJC += mpjc;
    totalGasolina += gasolina;
    totalDiesel += diesel;
    totalOtros += otros;

    mensaje += `*${i + 1}. ${r.marca || "SIN MARCA"} ${r.submarca || ""}*\n`;
    mensaje += `Fecha: ${r.fecha || "Sin fecha"}\n`;
    mensaje += `Hora: ${r.hora || "Sin hora"}\n`;
    mensaje += `Tipo de pago: ${textoTipo(r.tipo)}\n`;
    mensaje += `Aseguradora: ${r.aseguradora || "No aplica"}\n`;
    mensaje += `Corralón: ${textoCorralon(r.corralon)}\n`;
    mensaje += `Inventario: ${r.inventario || "No aplica"}\n`;
    mensaje += `Se baja gratis: ${r.gratis === "si" ? "Sí" : "No"}\n\n`;

    mensaje += `Ingreso: ${dinero(ingreso)}\n`;
    mensaje += `Ajustador: -${dinero(ajustador)}\n`;
    mensaje += `Policías: -${dinero(policia)}\n`;
    mensaje += `Pago MP/JC: -${dinero(mpjc)}\n`;
    mensaje += `Gasolina: -${dinero(gasolina)}\n`;
    mensaje += `Diésel: -${dinero(diesel)}\n`;
    mensaje += `Otros: -${dinero(otros)}\n`;
    mensaje += `Descuento por pagos: -${dinero(gastosRegistro)}\n`;
    mensaje += `Total final: ${dinero(totalRegistro)}\n\n`;
  });

  mensaje += `*RESUMEN GENERAL*\n`;
  mensaje += `Ingreso total: ${dinero(ingresoTotal)}\n\n`;

  mensaje += `*DESCUENTO POR PAGOS / GASTOS*\n`;
  mensaje += `Ajustador: -${dinero(totalAjustador)}\n`;
  mensaje += `Policías: -${dinero(totalPolicia)}\n`;
  mensaje += `MP/JC: -${dinero(totalMPJC)}\n`;
  mensaje += `Gasolina: -${dinero(totalGasolina)}\n`;
  mensaje += `Diésel: -${dinero(totalDiesel)}\n`;
  mensaje += `Otros: -${dinero(totalOtros)}\n`;
  mensaje += `Descuento total: -${dinero(descuentoPagos)}\n\n`;

  mensaje += `*TOTAL FINAL: ${dinero(totalFinal)}*`;

  const url = "https://wa.me/?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");
}

[
  "monto",
  "ajustador",
  "policia",
  "pagoMPJC",
  "gasolina",
  "diesel",
  "otros"
].forEach(id => {
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
