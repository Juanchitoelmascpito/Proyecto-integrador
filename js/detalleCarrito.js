let tablaCarrito = document.querySelector(".cart-table tbody");
let resumenSubTotal = document.querySelector(".res-sub-total");
let resumenDescuento = document.querySelector(".promo");
let resumenTotal = document.querySelector(".total");
let destino = document.querySelector(".destino");
let resumenDomicilio = document.querySelector(".valor-domi")
let btnResumen = document.querySelector(".btn-resumen");

document.addEventListener("DOMContentLoaded", ()=>{
    cargarProductos();
});

//funciar PARA cargar productos guardados

function cargarProductos(){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }

    //limpiar tabla
    tablaCarrito.innerHTML = "";

    if(todosProductos.length != 0){
        todosProductos.forEach((producto, i) => {
            //cargar tabla
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>
                    <div class="d-flex justify-content-evenly align-items-center">
                        <span onclick="borrarProducto(${i})" class="btn btn-danger">X</span>
                        <img src="${producto.imagen}" width="70px">
                        ${producto.nombre}
                    </div>
                </td>
                <td>
                    $${producto.precio}
                </td>
                <td>
                    <div class="quantity quantity-wrap">
                        <div class="decrement" onclick="actualizarCantidad(${i},-1)"> <i class="fa-solid fa-minus"></i> </div>
                        <input class="number" type="text" name="quantity" value="${producto.cantidad || 1}" maxlength="2" size="1" readonly>
                        <div class="increment" onclick="actualizarCantidad(${i},1)"> <i class="fa-solid fa-plus"></i> </div>
                    </div> 
                </td>
                <td> $${(producto.precio * producto.cantidad).toFixed(3)}</td>
            `;
            tablaCarrito.appendChild(fila);
        }); 
    }else{
        let fila = document.createElement("tr");
            fila.innerHTML = `
                <td colspan="4">
                    <p class="text-center fs-3"> No hay productos en el carrito </p>
                </td>
            `
        tablaCarrito.appendChild(fila);
    }

    // ejecutar el resumen de compra
    resumenCompra();
   
}

//función para actualizar la cantidad del producto

function actualizarCantidad( pos, cambio){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    if(todosProductos[pos]){
        //actualziar cantidad
        todosProductos[pos].cantidad = (todosProductos[pos].cantidad || 1) + cambio;

        //asegurarse de que cantidad sea mini de 1
        if(todosProductos[pos].cantidad <1 ){
            todosProductos[pos].cantidad = 1;
        }

        //calcula subtotal

        let subtotal = todosProductos[pos].precio * todosProductos[pos].cantidad;
    }

    //actualizar en localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));


    //regarga la tabla
    cargarProductos();
}

//eliminar productos del carrito

function borrarProducto(pos){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.splice(pos, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    //recargar tabla
    cargarProductos();
}

// Función para el resumen de la compra
function resumenCompra() {
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0; // Acumular el subtotal de los productos

    // Recorrer cada producto y acumular en el subtotal
    todosProductos.forEach((producto) => {
        subtotal += producto.precio * producto.cantidad;
    });

    let domicilio = 0;
    switch (destino.value){    
        case "Medellin": default: domicilio; break;
        case "Bello": domicilio = 10.000; break;
        case "Copacabana": case "Caldas": case "La Estrella": domicilio = 20.000; break;
        case "Envigado": case "Itagui": case "Sabaneta": domicilio = 15.000; break;
    }

    //calcular descuento del 10% ssi compra 100.000 o más
    let descuento = (subtotal > 100.000) ? subtotal * 0.1 : 0;

    //calcular el total a pagar
    let totalApagar = subtotal - descuento + domicilio;

    //calcular valor del domicilio



    // mostrar en el resumen
    resumenSubTotal.textContent = subtotal.toFixed(3);
    resumenDescuento.textContent = descuento.toFixed(3);
    resumenTotal.textContent = totalApagar.toFixed(3);
    resumenDomicilio.textContent = domicilio.toFixed(3);
}

//agragr evento al destino para calcular valor del domicilio
destino.addEventListener("change", ()=>{
    resumenCompra();
});

//evento al boton pagar para guardar el resumen en localSotrage
btnResumen.addEventListener("click", ()=>{
    //extraer los productos de localStorage
    let productos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let resumen = {
        //copia de todos los productos
        "productos" : productos,        
    }
    //llenar la variable resumen con la información del resumen de la comora
    resumen.subtotal = resumenSubTotal.textContent;
    resumen.descuento = resumenDescuento.textContent,
    resumen.destino = destino.value;
    resumen.domicilio = resumenDomicilio.textContent;
    resumen.totalApagar = resumenTotal.textContent;

    //guardar el resumen en localSotorage
    localStorage.setItem("pro-resumen", JSON.stringify(resumen));
    //redirigir el usuario a la pagina de pago
    location.href="checkout.html";

    //console.log(resumen);
});