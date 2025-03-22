// datosCompra

document.addEventListener("DOMContentLoaded", function () {
    mostrarResumenOrden();
    cargarDatosEntrega();

    document.querySelector(".btn-checkout").addEventListener("click", function () {
        guardarDatosEntrega();
    });

    // Agregar evento para detectar cambios en el método de pago
    document.querySelectorAll(".payment-method input[type='radio']").forEach(input => {
        input.addEventListener("change", actualizarTotalConMetodoPago);
    });
});

// Función para actualizar el total según el método de pago seleccionado
function actualizarTotalConMetodoPago() {
    let resumen = JSON.parse(localStorage.getItem("pro-resumen"));

    if (!resumen) return;

    let metodoPago = document.querySelector(".payment-method input[type='radio']:checked").value;
    let totalBase = parseFloat(resumen.totalApagar);
    let incremento = 0;

    switch (metodoPago) {
        case "1": // Contraentrega +5%
            incremento = totalBase * 0.05;
            break;
        case "2": // PSE +3%
            incremento = totalBase * 0.03;
            break;
        case "3": // Transferencia (0%)
            incremento = 0;
            break;
    }

    let nuevoTotal = totalBase + incremento;
    document.querySelector(".total").textContent = `$${nuevoTotal.toFixed(3)}`;
}

// Función para mostrar los datos del resumen de compra en la página de checkout
function mostrarResumenOrden() {
    let resumen = JSON.parse(localStorage.getItem("pro-resumen"));

    if (!resumen) {
        console.warn("No hay datos de resumen en localStorage.");
        return;
    }

    const contenedorProductos = document.querySelector(".productos");
    const subtotalElement = document.querySelector(".res-sub-total");
    const totalElement = document.querySelector(".total");
    const destinoElement = document.querySelector(".destino");
    const domicilioElement = document.querySelector(".valor-domi");
    const promoElement = document.querySelector(".promo");

    // Limpiar contenido anterior
    contenedorProductos.innerHTML = "";

    if (!resumen.productos || resumen.productos.length === 0) {
        contenedorProductos.innerHTML = "<p>No hay productos en el carrito</p>";
        subtotalElement.textContent = "$0.00";
        totalElement.textContent = "$0.00";
        domicilioElement.textContent = "$0.00";
        promoElement.textContent = "$0.00";
        destinoElement.textContent = "Sin destino";
        return;
    }

    // Mostrar los productos en el resumen de la orden
    resumen.productos.forEach(producto => {
        let productoHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <p class="lead">${producto.nombre} x${producto.cantidad}</p>
                <p class="lead">$${(producto.precio * producto.cantidad).toFixed(3)}</p>
            </div>
        `;
        contenedorProductos.innerHTML += productoHTML;
    });

    // Mostrar los valores de la compra
    subtotalElement.textContent = `$${parseFloat(resumen.subtotal).toFixed(3)}`;
    domicilioElement.textContent = `$${parseFloat(resumen.domicilio).toFixed(3)}`;
    promoElement.textContent = `$${parseFloat(resumen.descuento).toFixed(3)}`;
    totalElement.textContent = `$${parseFloat(resumen.totalApagar).toFixed(3)}`;
    destinoElement.textContent = resumen.destino;

    // Aplicar ajuste del método de pago
    actualizarTotalConMetodoPago();
}

// Función para guardar los datos de entrega en localStorage
function guardarDatosEntrega() {
    const datosEntrega = {
        nombres: document.getElementById("nombres-input").value,
        apellidos: document.getElementById("apellidos-input").value,
        email: document.getElementById("email-input").value,
        celular: document.getElementById("celular-input").value,
        direccion: document.getElementById("direccion-input").value,
        direccion2: document.getElementById("direccion-2-input").value,
        notas: document.getElementById("additiona-note").value
    };

    localStorage.setItem("datosEntrega", JSON.stringify(datosEntrega));
    alert("Datos de entrega guardados correctamente.");
}

// Función para cargar los datos guardados en el formulario de entrega
function cargarDatosEntrega() {
    const datosEntrega = JSON.parse(localStorage.getItem("datosEntrega"));

    if (datosEntrega) {
        document.getElementById("nombres-input").value = datosEntrega.nombres;
        document.getElementById("apellidos-input").value = datosEntrega.apellidos;
        document.getElementById("email-input").value = datosEntrega.email;
        document.getElementById("celular-input").value = datosEntrega.celular;
        document.getElementById("direccion-input").value = datosEntrega.direccion;
        document.getElementById("direccion-2-input").value = datosEntrega.direccion2;
        document.getElementById("additiona-note").value = datosEntrega.notas;
    }
}

document.querySelector(".btn-checkout").addEventListener("click", function () {
    guardarDatosEntrega();
    location.href = "thankyou.html";
});