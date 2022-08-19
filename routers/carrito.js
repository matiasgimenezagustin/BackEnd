const routerCarrito = require("express").Router()

const carritoClass = require("../classCarrito")
const carrito = new carritoClass


routerCarrito.get("/", (req, res) =>{

})
routerCarrito.post("/", (req, res) =>{
    console.log("POST REQUEST DONE")
    const id = carrito.createCart();
    res.json(carrito.getById(id))
})

routerCarrito.delete("/:id", (res, req) =>{
    const {id} = req.params
    res.json(carrito.carrito)
})

routerCarrito.get("/:id/productos", (res, req) =>{
    const {id} = req.params;
    res.json(carrito.getById(id));
})

routerCarrito.post("/:id/productos", (res, req) =>{
    const {id} = req.params;
    const {title, descripcion, codigo, thumbnail, price, stock, timestamp} = req.body
    res.json(carrito.addProduct(id, {
        title: title, 
        descripcion: descripcion, 
        codigo: codigo, 
        thumbnail: thumbnail, 
        priece: price, 
        stock: stock, 
        timestamp: timestamp
    }))
})

routerCarrito.delete("/:id/productos/:id_prod", (res, req) =>{
    const {id, id_prod} = req.params;
    carrito.deleteProduct(id, id_prod);
    res.json(carrito.carrito);
})


module.exports = routerCarrito;