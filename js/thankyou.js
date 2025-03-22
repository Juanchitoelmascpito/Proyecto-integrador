function infoCompra() {    
    let datosCliente = JSON.parse(localStorage.getItem("datosEntrega"));
    let valorTotal = JSON.parse(localStorage.getItem("pro-resumen"));

    console.log("Datos del cliente:", datosCliente);
    console.log("Resumen del pedido:", valorTotal);

    // Manejo del número de orden
    let numeroOrden = localStorage.getItem("numeroOrden");
    if (!numeroOrden) {
        numeroOrden = 1; 
    } else {
        numeroOrden = parseInt(numeroOrden) + 1;
    }
    localStorage.setItem("numeroOrden", numeroOrden); 

    // Actualizar número de orden en la página
    document.querySelector(".page-content p").textContent = `Orden #${numeroOrden}`;

    // Verifica si hay datos del comprador
    if (datosCliente) {
        const nombreCompleto = `${datosCliente.nombres}`.trim() || "Cliente";

        document.getElementById("comprador-nombre").textContent = datosCliente.nombres + datosCliente.apellidos;
        document.getElementById("comprador-email").textContent = datosCliente.email || "No disponible";
        document.getElementById("comprador-direccion").textContent = datosCliente.direccion || "No disponible";

        // Reemplazar "Cliente!" con el nombre del usuario (sin el "!") 
        let tituloCliente = document.querySelector(".resumen-compra h5 span");
        if (tituloCliente) {
            tituloCliente.textContent = nombreCompleto;
        }
    } else {
        console.warn("No se encontraron datos del comprador.");
    }

    // Verifica si hay un total a pagar
    if (valorTotal) {
        document.getElementById("total-pagar").textContent = valorTotal.totalApagar || "0.00";
    } else {
        console.warn("No se encontró el valor total.");
    }
}

// Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", infoCompra);

document.querySelector(".btn-gracias").addEventListener("click", function () {
    // Guarda el número de orden antes de limpiar
    let numeroOrden = localStorage.getItem("numeroOrden");

    // Limpia todo el localStorage
    localStorage.clear();

    // Restablece solo el número de orden
    localStorage.setItem("numeroOrden", numeroOrden);

    // Redirige a la página principal
    location.href = "index.html";
});