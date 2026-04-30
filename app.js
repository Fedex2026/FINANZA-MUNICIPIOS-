let datos = JSON.parse(localStorage.getItem("gruas")) || [];
let tipoSeleccionado = "efectivo";

function setTipo(tipo) {
  tipoSeleccionado = tipo;
  document.getElementById("tipo").value = tipo;

  document.getElementById("btnEfectivo").classList.remove("activo");
  document.getElementById("btnVale").classList.remove("activo");
  document.getElementById("btnTransferencia").classList.remove("activo");

  if (tipo === "efectivo") {
    document.getElementById("btnEfectivo").classList.add("activo");
    document.getElementById("aseguradora").style.display = "none";
  }

  if (tipo === "vale") {
    document.getElementById("btnVale").classList.add("activo");
    document.getElementById("aseguradora").style.display = "block";
  }

  if (tipo === "transferencia") {
    document.getElementById("btnTransferencia").classList.add("activo");
    document.getElementById("aseguradora").style.display = "none";
  }
}

function guardar() {
  const registro = {
    fecha: document.getElementById("fecha").value,
    marca: document.getElementById("marca").value,
    submarca: document.getElementById("submarca").value,
    tipo: document.getElementById("tipo").value || tipoSeleccionado,
    aseguradora: document.getElementById("aseguradora").value,
    monto: Number(document.getElementById("monto").value) || 0,
    ajustador: Number(document.getElementById("ajustador").value) || 0,
    policia: Number(document.getElementById("policia").value) || 0,
    corralon: document.getElementById("corralon").value,
    inventario: document.getElementById("inventario").value,
    gratis: document.getElementById("gratis").value
  };

  registro.gastos = registro.ajustador + registro.policia;
  registro.ganancia = registro.monto - registro.gastos;

  datos.push(registro);
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
        <b>${d.marca} ${d.submarca}</b>
        <span>Fecha: ${d.fecha}</span>
        <span>Tipo: ${d.tipo}</span>
        <span>Aseguradora: ${d.aseguradora || "No aplica"}</span>
        <span>Monto: $${d.monto}</span>
        <span>Ajustador: $${d.ajustador}</span>
        <span>Policías: $${d.policia}</span>
        <span>Corralón: ${d.corralon}</span>
        <span>Inventario: ${d.inventario || "No aplica"}</span>
        <span>Se baja gratis: ${d.gratis}</span>
        <div class="ganancia">Ganancia: $${d.ganancia}</div>
        <button onclick="eliminar(${index})">Eliminar</button>
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
    if (d.tipo === "efectivo") {
      totalEfectivo += d.monto;
    }

    if (d.tipo === "vale") {
      totalVale += d.monto;
    }

    if (d.tipo === "transferencia") {
      totalTransferencia += d.monto;
    }

    totalGastos += d.gastos;
    gananciaTotal += d.ganancia;
  });

  document.getElementById("totalEfectivo").innerText = "$" + totalEfectivo;
  document.getElementById("totalVale").innerText = "$" + totalVale;
  document.getElementById("totalGastos").innerText = "$" + totalGastos;
  document.getElementById("gananciaTotal").innerText = "$" + gananciaTotal;

  if (document.getElementById("totalTransferencia")) {
    document.getElementById("totalTransferencia").innerText = "$" + totalTransferencia;
  }
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
  document.getElementById("corralon").value = "no";
  document.getElementById("gratis").value = "no";

  setTipo("efectivo");
}

setTipo("efectivo");
mostrar();
