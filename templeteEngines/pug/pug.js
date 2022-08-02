// Express Config

const express = require("express");
const {Router} = express
const app = express();
const PORT = 8080;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import la class de productos

const classPoducts = require("../../classProducts");
const products = new classPoducts();


// Pug configs

app.set('view engine', 'pug');
app.set('views', './views'); 


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

routerProducts.post("/", (req, res) =>{

    console.log("Post request done")
    const {title, price, thumbnail} = req.body;
    products.save({
        title: title, 
        price: price, 
        thumbnail: thumbnail
    });
    res.render("listProducts", {products: products.products, exist: products.exist()});
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