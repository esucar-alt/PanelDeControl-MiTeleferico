// ==========================================
// VARIABLES Y ARREGLOS GLOBALES
// ==========================================

// Arreglo de objetos para el Módulo 2 (carga datos guardados si existen)
let listaMantenimiento = JSON.parse(localStorage.getItem("mantenimiento")) || [];

// Arreglo de objetos para el Módulo 4
let listaSensores = [];


// ==========================================
// MÓDULO 1: DETENCIÓN DE EMERGENCIA
// ==========================================
function calcularDetencion(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    const velocidad = parseFloat(document.getElementById("velocidad").value);
    const tiempo = parseFloat(document.getElementById("tiempo").value);
    const cajaResultado = document.getElementById("resultado-detencion");

    // Validar vacíos o números negativos
    if (isNaN(velocidad) || isNaN(tiempo) || velocidad < 0 || tiempo < 0) {
        cajaResultado.className = "caja-resultado resultado-error";
        cajaResultado.textContent = "Error: Ingresa valores numéricos válidos mayores o iguales a 0.";
        return;
    }

    // Fórmula del documento: d = (v / 3.6) * t
    const distancia = (velocidad / 3.6) * tiempo;

    // 3 niveles didácticos: Verde (<=50), Amarillo/Beige (50 a 100), Rojo (>100)
    if (distancia > 100) {
        cajaResultado.className = "caja-resultado resultado-error";
        cajaResultado.textContent = `Distancia de reacción: ${distancia.toFixed(2)} m. PELIGRO CRÍTICO: Distancia excesiva (supera los 100 m).`;
    } else if (distancia > 50) {
        cajaResultado.className = "caja-resultado resultado-alerta";
        cajaResultado.textContent = `Distancia de reacción: ${distancia.toFixed(2)} m. PRECAUCIÓN: Supera el umbral didáctico de 50 m.`;
    } else {
        cajaResultado.className = "caja-resultado resultado-ok";
        cajaResultado.textContent = `Distancia de reacción: ${distancia.toFixed(2)} m. ESTADO NORMAL: Dentro del rango seguro (hasta 50 m).`;
    }
}


// ==========================================
// MÓDULO 2: MANTENIMIENTO (ARREGLO DE OBJETOS)
// ==========================================

// Muestra u oculta el campo "Número de cabina" según el componente elegido
function verificarTipoComponente() {
    const componente = document.getElementById("componente").value;
    const cajaCabina = document.getElementById("campo-num-cabina");

    if (componente === "Cabina de pasajeros") {
        cajaCabina.style.display = "block";
    } else {
        cajaCabina.style.display = "none";
        document.getElementById("num-cabina").value = "";
    }
}

function agregarMantenimiento(evento) {
    evento.preventDefault();

    const linea = document.getElementById("linea").value;
    const componente = document.getElementById("componente").value;
    const numCabina = parseInt(document.getElementById("num-cabina").value);
    const horas = parseFloat(document.getElementById("horas").value);
    const estado = document.getElementById("estado").value;
    const cajaError = document.getElementById("error-mantenimiento");

    // Validar campos básicos
    if (linea === "" || componente === "" || isNaN(horas) || horas < 1 || horas > 50000) {
        cajaError.textContent = "Error: Selecciona la línea, el componente e ingresa horas válidas (1 a 50,000 hrs).";
        return;
    }

    let nombreFinalComponente = componente;

    // Si eligió Cabina de pasajeros, validar su número según la capacidad simulada de la línea
    if (componente === "Cabina de pasajeros") {
        let maxCabinas = 100; // Valor por defecto para líneas estándar
        if (linea === "Línea Plateada" || linea === "Línea Café") {
            maxCabinas = 35;
        } else if (linea === "Línea Morada" || linea === "Línea Roja") {
            maxCabinas = 120;
        }

        if (isNaN(numCabina) || numCabina < 1 || numCabina > maxCabinas) {
            cajaError.textContent = `Error: Para la ${linea}, el número de cabina debe estar entre 1 y ${maxCabinas}.`;
            return;
        }

        nombreFinalComponente = `${componente} #${numCabina}`;
    }

    cajaError.textContent = ""; // Limpiar error previo

    // Crear objeto y agregarlo al arreglo
    const nuevoRegistro = {
        linea: linea,
        componente: nombreFinalComponente,
        horas: horas,
        estado: estado
    };

    listaMantenimiento.push(nuevoRegistro);
    guardarYMostrarMantenimiento();

    // Limpiar campos y ocultar nuevamente el campo de cabina
    document.getElementById("form-mantenimiento").reset();
    verificarTipoComponente();
}

function eliminarMantenimiento(indice) {
    listaMantenimiento.splice(indice, 1);
    guardarYMostrarMantenimiento();
}

function guardarYMostrarMantenimiento() {
    localStorage.setItem("mantenimiento", JSON.stringify(listaMantenimiento));

    const tbody = document.getElementById("tabla-mantenimiento");
    tbody.innerHTML = "";

    for (let i = 0; i < listaMantenimiento.length; i++) {
        const item = listaMantenimiento[i];

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.linea || "Sin línea"}</td>
            <td>${item.componente}</td>
            <td>${item.horas} hrs</td>
            <td>${item.estado}</td>
            <td><button type="button" class="btn-eliminar" onclick="eliminarMantenimiento(${i})">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
    }
}

// ==========================================
// MÓDULO 3: VIENTO Y OSCILACIÓN (ARREGLO + CICLOS)
// ==========================================
// ==========================================
// MÓDULO 3: VIENTO Y OSCILACIÓN (ARREGLO + CICLOS)
// ==========================================
function analizarViento(evento) {
    evento.preventDefault();

    // Guardar las 5 mediciones en un arreglo
    const mediciones = [
        parseFloat(document.getElementById("v1").value),
        parseFloat(document.getElementById("v2").value),
        parseFloat(document.getElementById("v3").value),
        parseFloat(document.getElementById("v4").value),
        parseFloat(document.getElementById("v5").value)
    ];

    const cajaResultado = document.getElementById("resultado-viento");

    // Validar que los 5 campos tengan números válidos
    for (let i = 0; i < mediciones.length; i++) {
        if (isNaN(mediciones[i]) || mediciones[i] < 0) {
            cajaResultado.className = "caja-resultado resultado-error";
            cajaResultado.textContent = "Error: Debes ingresar las 5 mediciones numéricas válidas.";
            return;
        }
    }

    // Calcular suma y máximo usando un ciclo for
    let suma = 0;
    let maximo = mediciones[0];

    for (let i = 0; i < mediciones.length; i++) {
        suma = suma + mediciones[i];
        if (mediciones[i] > maximo) {
            maximo = mediciones[i];
        }
    }

    const promedio = suma / mediciones.length;

    // 3 niveles didácticos: Verde (<=30), Amarillo/Beige (30 a 50), Rojo (>50)
    if (promedio > 50) {
        cajaResultado.className = "caja-resultado resultado-error";
        cajaResultado.textContent = `Promedio: ${promedio.toFixed(2)} km/h | Máximo: ${maximo} km/h — PELIGRO: Viento demasiado fuerte (supera los 50 km/h).`;
    } else if (promedio > 30) {
        cajaResultado.className = "caja-resultado resultado-alerta";
        cajaResultado.textContent = `Promedio: ${promedio.toFixed(2)} km/h | Máximo: ${maximo} km/h — PRECAUCIÓN: Viento brusco (entre 30 y 50 km/h).`;
    } else {
        cajaResultado.className = "caja-resultado resultado-ok";
        cajaResultado.textContent = `Promedio: ${promedio.toFixed(2)} km/h | Máximo: ${maximo} km/h — ESTADO NORMAL: Viento leve/estable (hasta 30 km/h).`;
    }
}


// ==========================================
// MÓDULO 4: SENSORES (EXPRESIÓN REGULAR)
// ==========================================
// ==========================================
// MÓDULO 4: SENSORES (EXPRESIÓN REGULAR)
// ==========================================

// Muestra u oculta el campo de texto cuando se elige "Otro"
function verificarTipoSensor() {
    const tipo = document.getElementById("tipo-sensor").value;
    const cajaOtro = document.getElementById("campo-otro-sensor");

    if (tipo === "Otro") {
        cajaOtro.style.display = "block";
    } else {
        cajaOtro.style.display = "none";
        document.getElementById("otro-sensor").value = "";
    }
}

function registrarSensor(evento) {
    evento.preventDefault();

    const codigo = document.getElementById("codigo-sensor").value.trim();
    const tipoSeleccionado = document.getElementById("tipo-sensor").value;
    const otroSensor = document.getElementById("otro-sensor").value.trim();
    const lectura = parseFloat(document.getElementById("lectura-sensor").value);
    const cajaError = document.getElementById("error-sensores");

    // Expresión regular exigida en la guía: SEN- seguido de 3 dígitos
    const regexCodigo = /^SEN-\d{3}$/;

    // Determinar el nombre final del tipo de sensor
    let tipoFinal = tipoSeleccionado;
    if (tipoSeleccionado === "Otro") {
        tipoFinal = otroSensor;
    }

    if (codigo === "" || tipoFinal === "" || isNaN(lectura)) {
        cajaError.textContent = "Error: Todos los campos son obligatorios y la lectura debe ser numérica.";
        return;
    }

    if (!regexCodigo.test(codigo)) {
        cajaError.textContent = "Error de formato: El código debe ser SEN-000 (ejemplo: SEN-001).";
        return;
    }

    cajaError.textContent = ""; // Limpiar error

    listaSensores.push({ codigo: codigo, tipo: tipoFinal, lectura: lectura });
    mostrarSensores();

    document.getElementById("form-sensores").reset();
    verificarTipoSensor(); // Ocultar nuevamente el campo "Otro"
}

function mostrarSensores() {
    const tbody = document.getElementById("tabla-sensores");
    tbody.innerHTML = "";

    for (let i = 0; i < listaSensores.length; i++) {
        const s = listaSensores[i];
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${s.codigo}</td>
            <td>${s.tipo}</td>
            <td>${s.lectura}</td>
        `;
        tbody.appendChild(fila);
    }
}


// ==========================================
// EVENTOS PRINCIPALES (addEventListener)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    guardarYMostrarMantenimiento();

    // Escuchar cambios en las listas desplegables condicionales
    document.getElementById("componente").addEventListener("change", verificarTipoComponente);
    document.getElementById("tipo-sensor").addEventListener("change", verificarTipoSensor);

    // Conectar formularios con sus funciones
    document.getElementById("form-detencion").addEventListener("submit", calcularDetencion);
    document.getElementById("form-mantenimiento").addEventListener("submit", agregarMantenimiento);
    document.getElementById("form-viento").addEventListener("submit", analizarViento);
    document.getElementById("form-sensores").addEventListener("submit", registrarSensor);
});