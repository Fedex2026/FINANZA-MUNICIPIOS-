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

  const gastosExtra = document.getElementById("gastosExtra");
  const label = document.getElementById("labelMPJC");

  if (tipo === "no") {
    document.getElementById("corNo").classList.add("activo");
    gastosExtra.style.display = "none";
    limpiarGastosExtra();
  }

  if (tipo === "mp") {
    document.getElementById("corMP").classList.add("activo");
    gastosExtra.style.display = "block";
    label.innerText = "Pago a MP";
  }

  if (tipo === "jc") {
    document.getElementById("corJC").classList.add("activo");
    gastosExtra.style.display = "block";
    label.innerText = "Pago a JC";
  }

  if (tipo === "garantia") {
    document.getElementById("corGarantia").classList.add("activo");
    gastosExtra.style.display = "none";
    limpiarGastosExtra();
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
          <span>Gastos extra: ${dinero((d.pagoMPJC || 0) + (d.gasolina || 0) + (d.diesel || 0) + (d.otros || 0))}</span>
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

  limpiarGastosExtra();

  setTipo("efectivo");
  setCorralon("no");
  setGratis("no");
  actualizarPreview();
}

function irA(seccion) {
  if (seccion === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (seccion === "agregar") {
    document.querySelector(".agregarPanel").scrollIntoView({ behavior: "smooth" });
  }

  if (seccion === "resumen") {
    document.querySelector(".panel").scrollIntoView({ behavior: "smooth" });
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

    if (tipoReporte === "dia") {
      return r.fecha === hoy;
    }

    if (tipoReporte === "semana") {
      return r.fecha >= inicio && r.fecha <= hoy;
    }

    return false;
  });

  if (registrosFiltrados.length === 0) {
    alert("No hay registros para enviar.");
    return;
  }

  let totalIngreso = 0;
  let totalGastos = 0;
  let totalGanancia = 0;

  let mensaje = tipoReporte === "dia"
    ? `*REPORTE DEL DÍA*\nFecha: ${hoy}\n\n`
    : `*REPORTE SEMANAL*\nDel ${inicio} al ${hoy}\n\n`;

  registrosFiltrados.forEach((r, i) => {
    totalIngreso += r.monto || 0;
    totalGastos += r.gastos || 0;
    totalGanancia += r.ganancia || 0;

    mensaje += `*${i + 1}. ${r.marca || "SIN MARCA"} ${r.submarca || ""}*\n`;
    mensaje += `Fecha: ${r.fecha || "Sin fecha"}\n`;
    mensaje += `Hora: ${r.hora || "Sin hora"}\n`;
    mensaje += `Tipo: ${textoTipo(r.tipo)}\n`;
    mensaje += `Aseguradora: ${r.aseguradora || "No aplica"}\n`;
    mensaje += `Corralón: ${textoCorralon(r.corralon)}\n`;
    mensaje += `Inventario: ${r.inventario || "No aplica"}\n`;
    mensaje += `Ingreso: ${dinero(r.monto)}\n`;
    mensaje += `Ajustador: ${dinero(r.ajustador)}\n`;
    mensaje += `Policías: ${dinero(r.policia)}\n`;
    mensaje += `Pago MP/JC: ${dinero(r.pagoMPJC)}\n`;
    mensaje += `Gasolina: ${dinero(r.gasolina)}\n`;
    mensaje += `Diésel: ${dinero(r.diesel)}\n`;
    mensaje += `Otros: ${dinero(r.otros)}\n`;
    mensaje += `Gastos totales: ${dinero(r.gastos)}\n`;
    mensaje += `Ganancia: ${dinero(r.ganancia)}\n\n`;
  });

  mensaje += `*RESUMEN*\n`;
  mensaje += `Total ingreso: ${dinero(totalIngreso)}\n`;
  mensaje += `Total gastos: ${dinero(totalGastos)}\n`;
  mensaje += `Ganancia total: ${dinero(totalGanancia)}\n`;

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
