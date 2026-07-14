let datos = JSON.parse(localStorage.getItem("gruas")) || [];

let tipoSeleccionado = "efectivo";
let corralonSeleccionado = "no";
let gratisSeleccionado = "no";
let indiceEditando = null;

/* ========================================
   FUNCIONES GENERALES
======================================== */

function dinero(n) {
  return "$" + Number(n || 0).toLocaleString("es-MX");
}

function textoVales(n) {
  const cantidad = Number(n || 0);
  return cantidad + (cantidad === 1 ? " vale" : " vales");
}

function obtenerValor(id) {
  const elemento = document.getElementById(id);
  return elemento ? elemento.value : "";
}

function ponerValor(id, valor = "") {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.value = valor;
  }
}

function mostrarElemento(id, mostrar) {
  const elemento = document.getElementById(id);

  if (!elemento) return;

  elemento.classList.toggle("oculto", !mostrar);
  elemento.classList.toggle("visible", mostrar);
}

/* ========================================
   TIPO DE PAGO
======================================== */

function setTipo(tipo) {
  tipoSeleccionado = tipo;
  ponerValor("tipo", tipo);

  document.getElementById("btnEfectivo")?.classList.remove("activo");
  document.getElementById("btnVale")?.classList.remove("activo");
  document.getElementById("btnTransferencia")?.classList.remove("activo");

  const labelMonto = document.getElementById("labelMonto");
  const monto = document.getElementById("monto");
  const valePanel = document.getElementById("valePanel");

  if (tipo === "efectivo") {
    document.getElementById("btnEfectivo")?.classList.add("activo");

    if (valePanel) valePanel.style.display = "none";

    ponerValor("aseguradora", "");

    if (labelMonto) {
      labelMonto.innerText = "Monto recibido";
    }

    if (monto) {
      monto.placeholder = "Ej. 1500";
    }
  }

  if (tipo === "vale") {
    document.getElementById("btnVale")?.classList.add("activo");

    if (valePanel) valePanel.style.display = "block";

    if (labelMonto) {
      labelMonto.innerText = "Número de vales";
    }

    if (monto) {
      monto.placeholder = "Ej. 3";
    }
  }

  if (tipo === "transferencia") {
    document
      .getElementById("btnTransferencia")
      ?.classList.add("activo");

    if (valePanel) valePanel.style.display = "none";

    ponerValor("aseguradora", "");

    if (labelMonto) {
      labelMonto.innerText =
        "Monto recibido por transferencia";
    }

    if (monto) {
      monto.placeholder = "Ej. 1500";
    }
  }

  actualizarPreview();
}

/* ========================================
   CORRALÓN
======================================== */

function setCorralon(tipo) {
  corralonSeleccionado = tipo;
  ponerValor("corralon", tipo);

  document.getElementById("corNo")?.classList.remove("activo");
  document.getElementById("corMP")?.classList.remove("activo");
  document.getElementById("corJC")?.classList.remove("activo");
  document
    .getElementById("corGarantia")
    ?.classList.remove("activo");

  const pagoMPJCPanel =
    document.getElementById("pagoMPJCPanel");

  const label = document.getElementById("labelMPJC");
  const titulo = document.getElementById("tituloMPJC");

  if (tipo === "no") {
    document.getElementById("corNo")?.classList.add("activo");

    if (pagoMPJCPanel) {
      pagoMPJCPanel.style.display = "none";
    }

    ponerValor("pagoMPJC", "");
  }

  if (tipo === "mp") {
    document.getElementById("corMP")?.classList.add("activo");

    if (pagoMPJCPanel) {
      pagoMPJCPanel.style.display = "block";
    }

    if (titulo) titulo.innerText = "PAGO A MP";

    if (label) {
      label.innerText = "¿Cuánto se le dio al MP?";
    }
  }

  if (tipo === "jc") {
    document.getElementById("corJC")?.classList.add("activo");

    if (pagoMPJCPanel) {
      pagoMPJCPanel.style.display = "block";
    }

    if (titulo) titulo.innerText = "PAGO A JC";

    if (label) {
      label.innerText = "¿Cuánto se le dio al JC?";
    }
  }

  if (tipo === "garantia") {
    document
      .getElementById("corGarantia")
      ?.classList.add("activo");

    if (pagoMPJCPanel) {
      pagoMPJCPanel.style.display = "none";
    }

    ponerValor("pagoMPJC", "");
  }

  actualizarPreview();
}

/* ========================================
   BAJA GRATIS
======================================== */

function setGratis(valor) {
  gratisSeleccionado = valor;
  ponerValor("gratis", valor);

  document
    .getElementById("gratisSi")
    ?.classList.remove("activo");

  document
    .getElementById("gratisNo")
    ?.classList.remove("activo");

  if (valor === "si") {
    document
      .getElementById("gratisSi")
      ?.classList.add("activo");
  }

  if (valor === "no") {
    document
      .getElementById("gratisNo")
      ?.classList.add("activo");
  }
}

/* ========================================
   DETALLES DE GASTOS EXTRA
======================================== */

function controlarDetallesGastos() {
  const gasolina = Number(obtenerValor("gasolina")) || 0;
  const diesel = Number(obtenerValor("diesel")) || 0;
  const otros = Number(obtenerValor("otros")) || 0;

  mostrarElemento("detalleGasolina", gasolina > 0);
  mostrarElemento("detalleDiesel", diesel > 0);
  mostrarElemento("detalleOtros", otros > 0);

  if (gasolina <= 0) {
    ponerValor("gruaGasolina", "");
    ponerValor("operadorGasolina", "");
  }

  if (diesel <= 0) {
    ponerValor("gruaDiesel", "");
    ponerValor("operadorDiesel", "");
  }

  if (otros <= 0) {
    ponerValor("tipoOtroGasto", "");
    ponerValor("conceptoOtro", "");
    ponerValor("personaComida", "");

    mostrarElemento("conceptoOtroPanel", false);
    mostrarElemento("comidaPanel", false);
  }
}

function cambiarTipoOtroGasto() {
  const tipo = obtenerValor("tipoOtroGasto");

  mostrarElemento("conceptoOtroPanel", tipo === "OTRO");
  mostrarElemento("comidaPanel", tipo === "COMIDA");

  if (tipo !== "OTRO") {
    ponerValor("conceptoOtro", "");
  }

  if (tipo !== "COMIDA") {
    ponerValor("personaComida", "");
  }
}

/* ========================================
   GUARDAR O ACTUALIZAR
======================================== */

function guardar() {
  const fecha = obtenerValor("fecha");

  const marca = obtenerValor("marca")
    .trim()
    .toUpperCase();

  const submarca = obtenerValor("submarca")
    .trim()
    .toUpperCase();

  if (!fecha) {
    alert("Selecciona una fecha.");
    return;
  }

  if (!marca) {
    alert("Escribe la marca.");
    return;
  }

  const tipo = obtenerValor("tipo") || tipoSeleccionado;

  const cantidadCapturada =
    Number(obtenerValor("monto")) || 0;

  const gasolina =
    Number(obtenerValor("gasolina")) || 0;

  const diesel =
    Number(obtenerValor("diesel")) || 0;

  const otros =
    Number(obtenerValor("otros")) || 0;

  if (
    diesel > 0 &&
    !obtenerValor("gruaDiesel")
  ) {
    alert("Selecciona la grúa que cargó diésel.");
    return;
  }

  if (
    diesel > 0 &&
    !obtenerValor("operadorDiesel").trim()
  ) {
    alert("Escribe el nombre del operador del diésel.");
    return;
  }

  if (
    gasolina > 0 &&
    !obtenerValor("gruaGasolina").trim()
  ) {
    alert("Escribe la grúa que cargó gasolina.");
    return;
  }

  if (
    gasolina > 0 &&
    !obtenerValor("operadorGasolina").trim()
  ) {
    alert("Escribe el nombre del operador de gasolina.");
    return;
  }

  if (otros > 0 && !obtenerValor("tipoOtroGasto")) {
    alert("Selecciona en qué se utilizó el otro gasto.");
    return;
  }

  if (
    otros > 0 &&
    obtenerValor("tipoOtroGasto") === "COMIDA" &&
    !obtenerValor("personaComida").trim()
  ) {
    alert(
      "Escribe el nombre de la persona a quien se le dio comida."
    );
    return;
  }

  if (
    otros > 0 &&
    obtenerValor("tipoOtroGasto") === "OTRO" &&
    !obtenerValor("conceptoOtro").trim()
  ) {
    alert("Escribe la descripción del gasto.");
    return;
  }

  const horaOriginal =
    indiceEditando !== null && datos[indiceEditando]
      ? datos[indiceEditando].hora
      : new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit"
        });

  const registro = {
    fecha,
    marca,
    submarca,
    tipo,

    aseguradora:
      tipo === "vale"
        ? obtenerValor("aseguradora")
        : "",

    monto:
      tipo === "vale"
        ? 0
        : cantidadCapturada,

    numeroVales:
      tipo === "vale"
        ? cantidadCapturada
        : 0,

    ajustador:
      Number(obtenerValor("ajustador")) || 0,

    policia:
      Number(obtenerValor("policia")) || 0,

    corralon:
      obtenerValor("corralon") ||
      corralonSeleccionado,

    inventario: obtenerValor("inventario")
      .trim()
      .toUpperCase(),

    pagoMPJC:
      Number(obtenerValor("pagoMPJC")) || 0,

    gasolina,

    gruaGasolina: obtenerValor("gruaGasolina")
      .trim()
      .toUpperCase(),

    operadorGasolina:
      obtenerValor("operadorGasolina")
        .trim()
        .toUpperCase(),

    diesel,

    gruaDiesel:
      obtenerValor("gruaDiesel"),

    operadorDiesel:
      obtenerValor("operadorDiesel")
        .trim()
        .toUpperCase(),

    otros,

    tipoOtroGasto:
      obtenerValor("tipoOtroGasto"),

    conceptoOtro:
      obtenerValor("conceptoOtro")
        .trim()
        .toUpperCase(),

    personaComida:
      obtenerValor("personaComida")
        .trim()
        .toUpperCase(),

    gratis:
      obtenerValor("gratis") ||
      gratisSeleccionado,

    hora: horaOriginal
  };

  registro.gastos =
    registro.ajustador +
    registro.policia +
    registro.pagoMPJC +
    registro.gasolina +
    registro.diesel +
    registro.otros;

  registro.ganancia =
    registro.monto - registro.gastos;

  if (indiceEditando === null) {
    datos.unshift(registro);
  } else {
    datos[indiceEditando] = registro;
  }

  localStorage.setItem(
    "gruas",
    JSON.stringify(datos)
  );

  limpiarFormulario();
  mostrar();
}

/* ========================================
   MOSTRAR REGISTROS
======================================== */

function mostrar() {
  const lista = document.getElementById("lista");

  if (!lista) return;

  lista.innerHTML = "";

  if (datos.length === 0) {
    lista.innerHTML = `
      <div class="sinRegistros">
        No hay registros guardados.
      </div>
    `;

    resumen();
    return;
  }

  datos.forEach((d, index) => {
    const cantidadPrincipal =
      d.tipo === "vale"
        ? textoVales(d.numeroVales || d.monto)
        : dinero(d.monto);

    const detalleGasolina =
      Number(d.gasolina) > 0
        ? `
          <span>
            Gasolina: ${dinero(d.gasolina)}
          </span>
          <span>
            Grúa gasolina:
            ${d.gruaGasolina || "No especificada"}
          </span>
          <span>
            Operador gasolina:
            ${d.operadorGasolina || "No especificado"}
          </span>
        `
        : "";

    const detalleDiesel =
      Number(d.diesel) > 0
        ? `
          <span>
            Diésel: ${dinero(d.diesel)}
          </span>
          <span>
            Grúa diésel:
            ${d.gruaDiesel || "No especificada"}
          </span>
          <span>
            Operador diésel:
            ${d.operadorDiesel || "No especificado"}
          </span>
        `
        : "";

    const detalleOtros =
      Number(d.otros) > 0
        ? `
          <span>
            Otros gastos: ${dinero(d.otros)}
          </span>
          <span>
            Concepto:
            ${textoOtroGasto(d)}
          </span>
        `
        : "";

    lista.innerHTML += `
      <div class="card">
        <div class="carIcon">🚗</div>

        <div class="cardInfo">
          <small>
            ${d.hora || "00:00"}
            ·
            ${d.fecha || "Sin fecha"}
          </small>

          <b>
            ${d.marca || "SIN MARCA"}
          </b>

          <span>
            ${d.submarca || "Sin submarca"}
          </span>

          <span>
            ${
              d.tipo === "vale" &&
              d.aseguradora
                ? d.aseguradora
                : textoCorralon(d.corralon)
            }
          </span>

          <span>
            Inventario:
            ${d.inventario || "No aplica"}
          </span>

          <span>
            Pago MP/JC:
            ${dinero(d.pagoMPJC)}
          </span>

          ${detalleGasolina}
          ${detalleDiesel}
          ${detalleOtros}

          <span>
            Gastos totales:
            ${dinero(d.gastos)}
          </span>
        </div>

        <div class="cardRight">
          <span class="badge ${d.tipo}">
            ${textoTipo(d.tipo)}
          </span>

          <b>
            ${cantidadPrincipal}
          </b>

          <small>
            Total:
            ${dinero(d.ganancia)}
          </small>
        </div>

        <div class="accionesRegistro">
          <button
            type="button"
            class="editBtn"
            onclick="editarRegistro(${index})"
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            class="deleteBtn"
            onclick="eliminar(${index})"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    `;
  });

  resumen();
}

function textoOtroGasto(registro) {
  const tipo = registro.tipoOtroGasto || "";

  if (tipo === "COMIDA") {
    return `COMIDA PARA ${
      registro.personaComida ||
      "PERSONA NO ESPECIFICADA"
    }`;
  }

  if (tipo === "OTRO") {
    return (
      registro.conceptoOtro ||
      "OTRO GASTO"
    );
  }

  if (tipo) {
    return tipo;
  }

  return "NO ESPECIFICADO";
}

/* ========================================
   EDITAR
======================================== */

function editarRegistro(index) {
  const d = datos[index];

  if (!d) {
    alert("No se encontró el registro.");
    return;
  }

  indiceEditando = index;

  ponerValor("registroEditando", index);
  ponerValor("fecha", d.fecha || "");
  ponerValor("marca", d.marca || "");
  ponerValor("submarca", d.submarca || "");

  ponerValor(
    "monto",
    d.tipo === "vale"
      ? Number(d.numeroVales || 0)
      : Number(d.monto || 0)
  );

  ponerValor("ajustador", d.ajustador || "");
  ponerValor("policia", d.policia || "");
  ponerValor("inventario", d.inventario || "");

  setTipo(d.tipo || "efectivo");
  setCorralon(d.corralon || "no");
  setGratis(d.gratis || "no");

  ponerValor("aseguradora", d.aseguradora || "");
  ponerValor("pagoMPJC", d.pagoMPJC || "");
  ponerValor("gasolina", d.gasolina || "");
  ponerValor("gruaGasolina", d.gruaGasolina || "");
  ponerValor(
    "operadorGasolina",
    d.operadorGasolina || ""
  );

  ponerValor("diesel", d.diesel || "");
  ponerValor("gruaDiesel", d.gruaDiesel || "");
  ponerValor(
    "operadorDiesel",
    d.operadorDiesel || ""
  );

  ponerValor("otros", d.otros || "");
  ponerValor(
    "tipoOtroGasto",
    d.tipoOtroGasto || ""
  );

  ponerValor(
    "conceptoOtro",
    d.conceptoOtro || ""
  );

  ponerValor(
    "personaComida",
    d.personaComida || ""
  );

  controlarDetallesGastos();
  cambiarTipoOtroGasto();

  const saveBtn =
    document.getElementById("saveBtn");

  const cancelEditBtn =
    document.getElementById("cancelEditBtn");

  const tituloFormulario =
    document.getElementById("tituloFormulario");

  if (saveBtn) {
    saveBtn.innerHTML =
      "💾 ACTUALIZAR REGISTRO";

    saveBtn.classList.add("editando");
  }

  if (cancelEditBtn) {
    cancelEditBtn.style.display = "block";
  }

  if (tituloFormulario) {
    tituloFormulario.innerText =
      "EDITAR REGISTRO";
  }

  actualizarPreview();

  document
    .getElementById("agregar")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

function cancelarEdicion() {
  limpiarFormulario();
}

/* ========================================
   RESUMEN
======================================== */

function resumen() {
  let totalEfectivo = 0;
  let totalVale = 0;
  let totalTransferencia = 0;
  let totalGastos = 0;
  let gananciaTotal = 0;

  datos.forEach(d => {
    const monto = Number(d.monto) || 0;
    const gastos = Number(d.gastos) || 0;
    const ganancia = Number(d.ganancia) || 0;

    if (d.tipo === "efectivo") {
      totalEfectivo += monto;
    }

    if (d.tipo === "vale") {
      totalVale += Number(
        d.numeroVales || d.monto || 0
      );
    }

    if (d.tipo === "transferencia") {
      totalTransferencia += monto;
    }

    totalGastos += gastos;
    gananciaTotal += ganancia;
  });

  document.getElementById(
    "totalEfectivo"
  ).innerText = dinero(totalEfectivo);

  document.getElementById(
    "totalVale"
  ).innerText = textoVales(totalVale);

  document.getElementById(
    "totalTransferencia"
  ).innerText = dinero(totalTransferencia);

  document.getElementById(
    "totalGastos"
  ).innerText = dinero(totalGastos);

  document.getElementById(
    "gananciaTotal"
  ).innerText = dinero(gananciaTotal);
}

function actualizarPreview() {
  const cantidad =
    Number(obtenerValor("monto")) || 0;

  const ingreso =
    tipoSeleccionado === "vale"
      ? 0
      : cantidad;

  const ajustador =
    Number(obtenerValor("ajustador")) || 0;

  const policia =
    Number(obtenerValor("policia")) || 0;

  const pagoMPJC =
    Number(obtenerValor("pagoMPJC")) || 0;

  const gasolina =
    Number(obtenerValor("gasolina")) || 0;

  const diesel =
    Number(obtenerValor("diesel")) || 0;

  const otros =
    Number(obtenerValor("otros")) || 0;

  const gastos =
    ajustador +
    policia +
    pagoMPJC +
    gasolina +
    diesel +
    otros;

  const ganancia = ingreso - gastos;

  const previewIngreso =
    document.getElementById("previewIngreso");

  const previewGastos =
    document.getElementById("previewGastos");

  const previewGanancia =
    document.getElementById("previewGanancia");

  const previewTipo =
    document.getElementById("previewTipo");

  if (previewIngreso) {
    previewIngreso.innerText =
      tipoSeleccionado === "vale"
        ? textoVales(cantidad)
        : dinero(ingreso);
  }

  if (previewGastos) {
    previewGastos.innerText =
      dinero(gastos);
  }

  if (previewGanancia) {
    previewGanancia.innerText =
      dinero(ganancia);
  }

  if (previewTipo) {
    previewTipo.innerText =
      textoTipo(tipoSeleccionado);
  }
}

/* ========================================
   LIMPIAR FORMULARIO
======================================== */

function limpiarGastosExtra() {
  [
    "pagoMPJC",
    "gasolina",
    "gruaGasolina",
    "operadorGasolina",
    "diesel",
    "gruaDiesel",
    "operadorDiesel",
    "otros",
    "tipoOtroGasto",
    "conceptoOtro",
    "personaComida"
  ].forEach(id => ponerValor(id, ""));

  mostrarElemento("detalleGasolina", false);
  mostrarElemento("detalleDiesel", false);
  mostrarElemento("detalleOtros", false);
  mostrarElemento("conceptoOtroPanel", false);
  mostrarElemento("comidaPanel", false);
}

function limpiarFormulario() {
  indiceEditando = null;

  ponerValor("registroEditando", "");
  ponerValor("fecha", fechaLocalISO());
  ponerValor("marca", "");
  ponerValor("submarca", "");
  ponerValor("aseguradora", "");
  ponerValor("monto", "");
  ponerValor("ajustador", "");
  ponerValor("policia", "");
  ponerValor("inventario", "");

  limpiarGastosExtra();

  setTipo("efectivo");
  setCorralon("no");
  setGratis("no");

  const saveBtn =
    document.getElementById("saveBtn");

  const cancelEditBtn =
    document.getElementById("cancelEditBtn");

  const tituloFormulario =
    document.getElementById("tituloFormulario");

  if (saveBtn) {
    saveBtn.innerHTML =
      "💾 GUARDAR REGISTRO";

    saveBtn.classList.remove("editando");
  }

  if (cancelEditBtn) {
    cancelEditBtn.style.display = "none";
  }

  if (tituloFormulario) {
    tituloFormulario.innerText =
      "AGREGAR NUEVO REGISTRO";
  }

  actualizarPreview();
}

/* ========================================
   ELIMINAR
======================================== */

function eliminar(index) {
  const registro = datos[index];

  if (!registro) return;

  const confirmar = confirm(
    `¿Seguro que deseas eliminar el registro de ${
      registro.marca || "este vehículo"
    } ${registro.submarca || ""}?`
  );

  if (!confirmar) return;

  datos.splice(index, 1);

  localStorage.setItem(
    "gruas",
    JSON.stringify(datos)
  );

  if (indiceEditando === index) {
    limpiarFormulario();
  } else if (
    indiceEditando !== null &&
    index < indiceEditando
  ) {
    indiceEditando--;
  }

  mostrar();
}

/* ========================================
   TEXTOS
======================================== */

function textoTipo(tipo) {
  if (tipo === "efectivo") return "EFECTIVO";
  if (tipo === "vale") return "VALE";

  if (tipo === "transferencia") {
    return "🔴 TRANSFERENCIA";
  }

  return tipo || "";
}

function textoCorralon(corralon) {
  if (corralon === "no") return "NO CORRALÓN";
  if (corralon === "mp") return "MP";
  if (corralon === "jc") return "JC";

  if (corralon === "garantia") {
    return "GARANTÍA DE PAGO";
  }

  return corralon || "NO CORRALÓN";
}

/* ========================================
   MENÚ Y NAVEGACIÓN
======================================== */

function abrirMenu() {
  document
    .getElementById("menuLateral")
    ?.classList.add("activo");
}

function cerrarMenu() {
  document
    .getElementById("menuLateral")
    ?.classList.remove("activo");
}

function irA(seccion) {
  cerrarMenu();

  if (seccion === "inicio") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (seccion === "agregar") {
    document
      .querySelector(".agregarPanel")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  if (seccion === "resumen") {
    document
      .querySelector(".resumenPanel")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  if (seccion === "registros") {
    document
      .querySelector(".registrosPanel")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }
}

/* ========================================
   FECHAS
======================================== */

function fechaLocalISO(fecha = new Date()) {
  const y = fecha.getFullYear();

  const m = String(
    fecha.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    fecha.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function inicioSemana(fecha = new Date()) {
  const f = new Date(fecha);
  const dia = f.getDay();
  const diferencia = dia === 0 ? 6 : dia - 1;

  f.setDate(f.getDate() - diferencia);

  return fechaLocalISO(f);
}

/* ========================================
   WHATSAPP
======================================== */

function enviarWhatsApp(tipoReporte) {
  const hoy = fechaLocalISO();
  const inicio = inicioSemana();

  const registrosFiltrados = datos.filter(r => {
    if (!r.fecha) return false;

    if (tipoReporte === "dia") {
      return r.fecha === hoy;
    }

    if (tipoReporte === "semana") {
      return (
        r.fecha >= inicio &&
        r.fecha <= hoy
      );
    }

    return false;
  });

  if (registrosFiltrados.length === 0) {
    alert("No hay registros para enviar.");
    return;
  }

  let totalEfectivo = 0;
  let totalVale = 0;
  let totalTransferencia = 0;

  let ingresoTotal = 0;
  let descuentoPagos = 0;
  let totalFinal = 0;

  let totalAjustador = 0;
  let totalPolicia = 0;
  let totalMPJC = 0;
  let totalGasolina = 0;
  let totalDiesel = 0;
  let totalOtros = 0;

  let mensaje =
    tipoReporte === "dia"
      ? `*REPORTE DEL DÍA*\nFecha: ${hoy}\n\n`
      : `*REPORTE SEMANAL*\nDel ${inicio} al ${hoy}\n\n`;

  registrosFiltrados.forEach((r, i) => {
    const ingreso =
      r.tipo === "vale"
        ? 0
        : Number(r.monto) || 0;

    const numeroVales =
      r.tipo === "vale"
        ? Number(
            r.numeroVales ||
            r.monto ||
            0
          )
        : 0;

    const ajustador =
      Number(r.ajustador) || 0;

    const policia =
      Number(r.policia) || 0;

    const mpjc =
      Number(r.pagoMPJC) || 0;

    const gasolina =
      Number(r.gasolina) || 0;

    const diesel =
      Number(r.diesel) || 0;

    const otros =
      Number(r.otros) || 0;

    const gastosRegistro =
      ajustador +
      policia +
      mpjc +
      gasolina +
      diesel +
      otros;

    const totalRegistro =
      ingreso - gastosRegistro;

    if (r.tipo === "efectivo") {
      totalEfectivo += ingreso;
    }

    if (r.tipo === "vale") {
      totalVale += numeroVales;
    }

    if (r.tipo === "transferencia") {
      totalTransferencia += ingreso;
    }

    ingresoTotal += ingreso;
    descuentoPagos += gastosRegistro;
    totalFinal += totalRegistro;

    totalAjustador += ajustador;
    totalPolicia += policia;
    totalMPJC += mpjc;
    totalGasolina += gasolina;
    totalDiesel += diesel;
    totalOtros += otros;

    mensaje += `*${i + 1}. ${
      r.marca || "SIN MARCA"
    } ${r.submarca || ""}*\n`;

    mensaje += `Fecha: ${
      r.fecha || "Sin fecha"
    }\n`;

    mensaje += `Hora: ${
      r.hora || "Sin hora"
    }\n`;

    mensaje += `Tipo de pago: ${
      textoTipo(r.tipo)
    }\n`;

    mensaje += `Aseguradora: ${
      r.aseguradora || "No aplica"
    }\n`;

    mensaje += `Corralón: ${
      textoCorralon(r.corralon)
    }\n`;

    mensaje += `Inventario: ${
      r.inventario || "No aplica"
    }\n`;

    mensaje += `Se baja gratis: ${
      r.gratis === "si" ? "Sí" : "No"
    }\n\n`;

    if (r.tipo === "vale") {
      mensaje += `Número de vales: ${
        textoVales(numeroVales)
      }\n`;
    } else {
      mensaje += `Ingreso: ${
        dinero(ingreso)
      }\n`;
    }

    mensaje += `Ajustador: -${dinero(ajustador)}\n`;
    mensaje += `Policías: -${dinero(policia)}\n`;
    mensaje += `Pago MP/JC: -${dinero(mpjc)}\n`;

    mensaje += `Gasolina: -${dinero(gasolina)}\n`;

    if (gasolina > 0) {
      mensaje += `Grúa gasolina: ${
        r.gruaGasolina || "No especificada"
      }\n`;

      mensaje += `Operador gasolina: ${
        r.operadorGasolina || "No especificado"
      }\n`;
    }

    mensaje += `Diésel: -${dinero(diesel)}\n`;

    if (diesel > 0) {
      mensaje += `Grúa diésel: ${
        r.gruaDiesel || "No especificada"
      }\n`;

      mensaje += `Operador diésel: ${
        r.operadorDiesel || "No especificado"
      }\n`;
    }

    mensaje += `Otros: -${dinero(otros)}\n`;

    if (otros > 0) {
      mensaje += `Concepto: ${
        textoOtroGasto(r)
      }\n`;
    }

    mensaje += `Descuento por pagos: -${
      dinero(gastosRegistro)
    }\n`;

    mensaje += `Total final: ${
      dinero(totalRegistro)
    }\n\n`;
  });

  mensaje += `*RESUMEN GENERAL*\n`;
  mensaje += `Efectivo: ${dinero(totalEfectivo)}\n`;
  mensaje += `Vales: ${textoVales(totalVale)}\n`;

  mensaje += `🔴 Transferencias: ${
    dinero(totalTransferencia)
  }\n`;

  mensaje += `Ingreso total: ${
    dinero(ingresoTotal)
  }\n\n`;

  mensaje += `*DESCUENTO POR PAGOS / GASTOS*\n`;
  mensaje += `Ajustador: -${dinero(totalAjustador)}\n`;
  mensaje += `Policías: -${dinero(totalPolicia)}\n`;
  mensaje += `MP/JC: -${dinero(totalMPJC)}\n`;
  mensaje += `Gasolina: -${dinero(totalGasolina)}\n`;
  mensaje += `Diésel: -${dinero(totalDiesel)}\n`;
  mensaje += `Otros: -${dinero(totalOtros)}\n`;

  mensaje += `Descuento total: -${
    dinero(descuentoPagos)
  }\n\n`;

  mensaje += `*TOTAL FINAL: ${
    dinero(totalFinal)
  }*`;

  const url =
    "https://wa.me/?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");
}

/* ========================================
   EVENTOS
======================================== */

[
  "monto",
  "ajustador",
  "policia",
  "pagoMPJC",
  "gasolina",
  "diesel",
  "otros"
].forEach(id => {
  const campo = document.getElementById(id);

  if (campo) {
    campo.addEventListener("input", () => {
      actualizarPreview();
      controlarDetallesGastos();
    });
  }
});

document
  .getElementById("tipoOtroGasto")
  ?.addEventListener(
    "change",
    cambiarTipoOtroGasto
  );

/* ========================================
   INICIO
======================================== */

const fechaHoy =
  document.getElementById("fechaHoy");

if (fechaHoy) {
  fechaHoy.innerText =
    new Date().toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
}

ponerValor("fecha", fechaLocalISO());

setTipo("efectivo");
setCorralon("no");
setGratis("no");

controlarDetallesGastos();
cambiarTipoOtroGasto();
actualizarPreview();
mostrar();
