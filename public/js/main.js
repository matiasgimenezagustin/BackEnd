

const urlProductRouter = 'http://localhost:8080/api/products/';
let username = 'user1234';


const sendAdminState = (username) =>{
    fetch("http://localhost:8080/api/products/admin", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            admin: username
        })
    }).then((resp) =>{
        console.log(resp)
    })
}

const listProducts = document.getElementById('listProducts');
const switchToAdminMode = () => {
  if (username === 'admin1234') {
    username = 'user1234';
    sendAdminState(username)
    Toastify({
      text: 'Admin Mode Desactivated',
      duration: 5000,
      style: {
        background: 'red',
      },
    }).showToast();
  } else {
    username = 'admin1234';
    Toastify({
      text: 'Admin Mode Activated',
      duration: 5000,
      style: {
        background: 'green',
      },
    }).showToast();
  }
};

//Template string de la lista de productos

const renderListProducts = (data) => {
    const contenedor = document.createElement('div');
    if(data.admin){
        contenedor.innerHTML = `
        <div class="controlsContainer">
        <h3>Controls</h3>
        </hr>
        <div>
            <label for="productId">Busca por ID</label>
            <input type="number" id="productId" class="input finder">
            <button onclick="findIdProduct()" class="submit"><a href="./productDetail.html">buscar</a></button>
        </div>
        </div>
        `
    if (data.exist) {
        data.products.forEach((product) => {
        contenedor.innerHTML += `
            <ul >
                <li>Nombre: ${product.title}</li>
                <li>Precio: ${product.price}</li>
                <li><img src=${product.thumbnail} alt=""><li>
                <li>PLU: ${product.codigo}</li>
                <li>stock: ${product.stock}</li>
                <li>Fecha y Hora: ${product.timestamp}</li>
                <li><p>Descripcion: ${product.descripcion}</p></li>
            </ul>
            <hr/>
            `;
        });
    }else {
    contenedor.innerHTML = `<h2>No hay productos en la lista</h2>`;
    }
  }else{
    contenedor.innerHTML = `<h2>No tienes permisos de administrador para hacer esa accion</h2>`
  }
  
  listProducts.appendChild(contenedor);
};


//template string de el detalle del producto
const renderProductDetail = (data) =>{
    const productDetailContainer = document.getElementById("productDetailContainer");
    let contenedor = document.createElement("div");
    if(data.error === "Producto no encontrado"){
        contenedor.innerHTML = `<h1>El producto con ID seleccionado no existe</h1>`
    }else{
        contenedor.innerHTML =
        `<h1>
        Producto seleccionado
        </h1>
        </hr>
        <ul >
            <li>Nombre: ${data.productSelect.title}</li>
            <li>Precio: ${data.productSelect.price}</li>
            <li><img src=${data.productSelect.thumbnail} alt=""><li>
            <li>PLU: ${data.productSelect.codigo}}</li>
            <li>stock: ${data.productSelect.stock}</li>
            <li>Fecha y Hora: ${data.productSelect.timestamp}</li>
        <li><p>Descripcion: ${data.productSelect.descripcion}</p></li>
        </ul>`
        if(data.admin){
            contenedor.innerHTML += 
            `<div class="formContainer updateContainer">
                <h2>Actualizar Producto</h2>
                <input type="text" class="input" value=${data.productSelect.title} id="updateTitle">
                <input type="text" class="input" value=${data.productSelect.price} id="updatePrice">
                <input type="text" class="input" value=${data.productSelect.thumbnail} id="updateThumbnail">
                <input type="text" class="input" value=${data.productSelect.codigo}} id="updateCodigo">
                <input type="text" class="input" value=${data.productSelect.stock} id="updateStock">
                <input type="text" class="input" value=${data.productSelect.timestamp} id="updateTimestamp">
                <input type="text" class="input" value=${data.productSelect.descripcion} id="updateDescripcion">
                <button onclick="updateProduct()" class="submit">Actualizar Producto</button>
            </div>`
            
        }
    }
    productDetailContainer.appendChild(contenedor);
}

//Funcion add product a la API
const sendForm = () => {
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const thumbnail = document.getElementById('thumbnail').value;
  const codigo = document.getElementById('codigo').value;
  const stock = document.getElementById('stock').value;
  const descripcion = document.getElementById('descripcion').value;
  console.log(title, price, thumbnail, codigo, stock, descripcion);
  fetch(urlProductRouter, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      price: price,
      thumbnail: thumbnail,
      codigo: codigo,
      stock: stock,
      descripcion: descripcion,
      admin: username,
    }),
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      renderListProducts(data);
    });
};
const callProducts = () => {
    fetch(urlProductRouter, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        renderListProducts(data);
      });
  };
if(window.location.pathname === "/public/index.html"){
    callProducts();
}
if(window.location.pathname === "/public/productDetail.html"){
    const data = JSON.parse(localStorage.getItem("productDetail"))
    renderProductDetail(data)
}

const findIdProduct = () =>{
    const id = document.getElementById("productId").value;
    fetch(urlProductRouter + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((resp)=>{
        return resp.json()
    }).then((data) =>{
        localStorage.setItem("productDetail", JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem("productDetail")))
    })
}


const updateProduct = () =>{

    const title = document.getElementById("updateTitle").value;
    const price = document.getElementById("updatePrice").value;
    const thumbnail = document.getElementById("updateThumbnail").value;
    const codigo = document.getElementById("updateCodigo").value;
    const stock = document.getElementById("updateStock").value;
    const descripcion = document.getElementById("updateDescripcion").value;
    const detailProductID = JSON.parse(localStorage.getItem("productDetail"))
    
    fetch("http://localhost:8080/api/products/" + detailProductID.productSelect.id,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title, 
            price: price,
            thumbnail: thumbnail,
            codigo: codigo,
            stock: stock,
            descripcion: descripcion,
            admin: username,
        })
    }).then((resp) =>{
        return resp.json();
    }).then((data) =>{
        console.log(data)
        localStorage.setItem("productDetail", JSON.stringify(data))
        renderProductDetail(data)

    })
} 

/* let username = "user1234"
const urlProductRouter= "http://localhost:8080/api/products/";

const listProducts = document.getElementById("listProducts")
//First GET
const callProducts = () =>{
    fetch(urlProductRouter,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    }).then((resp) =>{
        return resp.json()
    }).then((data) =>{
        console.log(data)
        const contenedor = document.createElement("div");
        if(data.exist){
            contenedor.innerHTML =
            `
            <ul >
                <li>Nombre: ${data.products.title}</li>
                <li>Precio: ${data.products.price}</li>
                <li><img src=${data.products.thumbnail} alt=""><li>
                <li>PLU: ${data.products.codigo}</li>
                <li>stock: ${data.products.stock}</li>
                <li>Fecha y Hora: ${data.products.timestamp}</li>
                <li><p>Descripcion: ${data.products.descripcion}</p></li>
                </ul>
                <hr/>
            `;
        }
        
        //Agregamos el contenedor creado al body
        document.body.appendChild(contenedor);
    })
}

const switchToAdminMode = () =>{
    if (username === "admin1234"){
        username = "user1234"
        Toastify({
            text: "Admin Mode Desactivated",
            duration: 5000,
            style: {
                background: "red",
            },
        }).showToast()
    }else{
        username = "admin1234"
        Toastify({
            text: "Admin Mode Activated",
            duration: 5000,
            style: {
                background: "green",
            },
        }).showToast()
    }
}



const sendForm = () =>{
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value
    const codigo = document.getElementById("codigo").value
    const stock = document.getElementById("stock").value
    const descripcion = document.getElementById("descripcion").value
    console.log(title, price, thumbnail, codigo, stock, descripcion)
    fetch(urlProductRouter,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title, 
            price: price,
            thumbnail: thumbnail,
            codigo: codigo,
            stock: stock,
            descripcion: descripcion,
            admin: username
        })
    }).then((resp) =>{
        return resp.json()
    }).then((textmsg)=>{
        fetch(
            "http://localhost:8080/viewsHandlebars/listProducts.hbs"
        ).then((resp) =>{
            return resp.text()
        }).then((text) =>{
            console.log(textmsg)
            const template = Handlebars.compile(text)
            const html = template({products: textmsg.products, exist: textmsg.exist, admin: textmsg.admin})
            document.getElementById("listProducts").innerHTML = html
        })
    })
}

const findIdProduct = () =>{
    const id = document.getElementById("productId").value;
    location.href = "http://localhost:8080/api/products/" + id;
}

const updateProduct = () =>{

    const title = document.getElementById("updateTitle").value;
    const price = document.getElementById("updatePrice").value;
    const thumbnail = document.getElementById("updateThumbnail").value;
    const codigo = document.getElementById("updateCodigo").value;
    const stock = document.getElementById("updateStock").value;
    const descripcion = document.getElementById("updateDescripcion").value;

    fetch("http://localhost:8080/api/products",{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title, 
            price: price,
            thumbnail: thumbnail,
            codigo: codigo,
            stock: stock,
            descripcion: descripcion,
            admin: username,
        })
    })
} */

/* .then((object) =>{
        fetch("http://localhost:8080/viewsHandlebars/products.hbs", 
            {method: "GET",
            headers: new Headers({
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
            })
        })
        .then((resp) =>{
            console.log(resp)
            return resp.text()
            
        }).then((text) =>{
            console.log(text)
            const template = Handlebars.compile(text)
            const html = template({products: object.products, exist: object.exist, admin: object.admin})
            console.log(html)
            document.getElementById("mainContainer").innerHTML = html
        })
    }) */
    