//TP 5 BackEnd:

/* >> Consigna:  
Utilizando la misma API de productos del proyecto entregable de la clase anterior, construir un web server (no REST) que incorpore:
Un formulario de carga de productos en la ruta raíz (configurar la ruta '/productos' para recibir el POST, y redirigir al mismo formulario).
Una vista de los productos cargados (utilizando plantillas de handlebars) en la ruta GET '/productos'.
Ambas páginas contarán con un botón que redirija a la otra.
 */




// Express Config
const express = require("express");
const {Router} = express
const app = express();
const PORT = 8080;
app.use(express.static(__dirname + "public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Import la class de productos
const classPoducts = require("./classProducts");

//a resolver cuando el profe explique lo de los router...
/* const postProduct = require("./productsRouter") */


// Handlebars configs 

/* 
const handlebars = require("express-handlebars")
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/viewsHandlebars/layouts",
    partialsDir: __dirname + "/viewsHandlebars/partials/"
})
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs");
app.set("views", "./viewsHandlebars") */

// Pug configs

/* 
app.set('view engine', 'pug');
app.set('views', './viewsPug'); 
*/

// EJS configs

const ejs = require("ejs");
app.set("view engine", "ejs");


const products = new classPoducts();


app.get("/", (req, res) => {
    res.render("main");
});
//Router express incorporado
const routerProducts = Router();
app.use("/products", routerProducts);

routerProducts.get("/", (req, res) =>{
    console.log(products.products)
    res.render("products", {say: "hello"});
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


routerProducts.delete("/:id", (req, res) =>{
    const {id} = req.params;
    if(isNaN(id)|| id < 1){
        res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
    }else{
        products.deleteById(parseInt(id));
    }
    res.render("listProducts", {products: products, exist: products.exist()});
})

routerProducts.put("/:id", (req, res) =>{
    const {id} = req.params;
    const {title, price, thumbnail} = req.body;
    if(isNaN(id)|| id < 1){
        res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
    }else{
        products.save({title: title, price: price, thumbnail: thumbnail}, parseInt(id));
    }
    res.render("listProducts", {products: products, exist: products.exist()});
})

//Listener server
app.listen(PORT, ()=>{
    console.log(`Exito: El servidor se esta escuchando en el puerto ${PORT}`);
});

app.on("Error", error => console.log("Error", error));


