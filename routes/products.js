const routerProducts = require("express").Router()


//Class de productos importada
const classPoducts = require("../classProducts");
const products = new classPoducts();
routerProducts.get("/", (req, res) =>{
    console.log(products.products);
    res.render("products", {say: "hello"});
})

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






module.exports = routerProducts