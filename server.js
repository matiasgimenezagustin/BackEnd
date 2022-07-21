//TP 4 BackEnd:
//CONSIGNA--->
/* Realizar un proyecto de servidor basado en node.js y express que ofrezca una API RESTful de productos. En detalle, que incorpore las siguientes rutas:
GET '/api/productos' -> devuelve todos los productos.
GET '/api/productos/:id' -> devuelve un producto según su id.
POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
DELETE '/api/productos/:id' -> elimina un producto según su id. */


//PRODUCT OBJ STRUCTURE--->
/* {
    title: (nombre del producto),
    price: (precio),
    thumbnail: (url al logo o foto del producto)
} */

//A tener en cuenta --->

/* Cada ítem almacenado dispondrá de un id numérico proporcionado por el backend, comenzando en 1, y que se irá incrementando a medida de que se incorporen productos. Ese id será utilizado para identificar un producto que va a ser listado en forma individual. | HECHO

Para el caso de que un producto no exista, se devolverá el objeto:
{ error : 'producto no encontrado' } | HECHO

Implementar la API en una clase separada, utilizando un array como soporte de persistencia en memoria. | HECHO

Incorporar el Router de express en la url base '/api/productos' y configurar todas las subrutas en base a este. | HECHO

Crear un espacio público de servidor que contenga un documento index.html con un formulario de ingreso de productos con los datos apropiados. | HECHO

El servidor debe estar basado en express y debe implementar los mensajes de conexión al puerto 8080 y en caso de error, representar la descripción del mismo. | HECHO

Las respuestas del servidor serán en formato JSON. La funcionalidad será probada a través de Postman y del formulario de ingreso. | HECHO
*/



// Express Config
const classPoducts = require("./classProducts");
const express = require("express");
const {Router} = express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const products = new classPoducts();

//Router express incorporado
const routerProducts = Router();
app.use("/api/products", routerProducts);

routerProducts.get("/", (req, res) =>{
    res.send(products.products);
});

routerProducts.get("/:id", (req, res) =>{
    const {id} = req.params;
    const productSelect = products.getById(parseInt(id));
    if(isNaN(productSelect)){
        res.json({error: "Producto no encontrado"})
    }else{
        res.send(productSelect);
    }
});

routerProducts.post("/", (req, res) =>{
    console.log("Post request done")
    const {title, price, thumbnail} = req.body;
    products.save({title: title, price: price, thumbnail: thumbnail})
    ;

    res.json(products);
});

routerProducts.delete("/:id", (req, res) =>{
    const {id} = req.params;
    if(isNaN(id)|| id < 1){
        res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
    }else{
        products.deleteById(parseInt(id));
    }
    res.json(products);
})

routerProducts.put("/:id", (req, res) =>{
    const {id} = req.params;
    const {title, price, thumbnail} = req.body;
    if(isNaN(id)|| id < 1){
        res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
    }else{
        products.save({title: title, price: price, thumbnail: thumbnail}, parseInt(id));
    }
    res.json(products);
})

//Listener server
app.listen(PORT, ()=>{
    console.log(`Exito: El servidor se esta escuchando en el puerto ${PORT}`);
});

app.on("Error", error => console.log("Error", error));



