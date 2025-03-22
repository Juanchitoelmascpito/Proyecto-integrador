// Variables globales
let btnProducts = document.querySelectorAll(".btn-product");
let contadorCarrito = document.querySelector(".contar-pro");
let listadoCarrito = document.querySelector(".list-cart tbody");
let con = 0;

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProLocalStorage();
});

// Agregar evento a los botones de productos
btnProducts.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        // Incrementar contador de productos
        con++;
        contadorCarrito.textContent = con;

        // Agregar información del producto al carrito
        infoProducto(i);
    });
});

// Agregar producto al carrito
function agregarProducto(producto) {
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td class="item-number">${con}</td>
        <td><img src="${producto.imagen}" width="70px"></td>
        <td>${producto.nombre}</td>
        <td> $${producto.precio}</td>
        <td><span onclick="borrarProducto(this)" class="btn btn-danger">X</span></td>
    `;
    listadoCarrito.appendChild(fila);
}

// Función para agregar información del producto al carrito
function infoProducto(pos) {
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;

    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1,
    };
    agregarProducto(infoPro);
    guardarProductoLocalStorage(infoPro);
}

// Función para eliminar un producto del carrito
function borrarProducto(pos) {
    let fila = pos.parentElement.parentElement;
    fila.remove();

    // Disminuir el contador
    if (con > 0) {
        con--;
        contadorCarrito.textContent = con;
    }
    eliminarProLocalSotorage(pos);

    // Renumerar productos en el carrito
    renumerarCarrito();
}

// Función para renumerar los productos en el carrito
function renumerarCarrito() {
    let filas = listadoCarrito.querySelectorAll("tr");
    let numero = 1;

    filas.forEach((fila) => {
        let columnaNumero = fila.querySelector(".item-number");
        columnaNumero.textContent = numero;
        numero++;
    });
}

// Guardar los productos en localStorage
function guardarProductoLocalStorage(producto) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

// Eliminar producto de localStorage
function eliminarProLocalSotorage(pos) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.splice(pos - 1, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

// Cargar productos de localStorage en el carrito
function cargarProLocalStorage() {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }

    // Cargar productos en el carrito
    todosProductos.forEach((producto) => {
        con++; // Incrementar contador para cada producto cargado
        agregarProducto(producto);
    });

    // Actualizar contador visible
    contadorCarrito.textContent = con;

    // Renumerar los productos (en caso de inconsistencias)
    renumerarCarrito();
}

contadorCarrito.parentElement.addEventListener("click", ()=>{
    listadoCarrito.parentElement.classList.toggle("ocultar");
})
