const routerProducts = require("express").Router()
const isAnAdmin = require("../admin");



//Class de productos importada
const classPoducts = require("../classProducts");
const products = new classPoducts();



routerProducts.post("/admin", (req, res) =>{
    const {admin} = req.body;
    console.log(admin);
    res.json({admin: isAnAdmin(admin)});
})
routerProducts.get("/", (req, res) =>{
    console.log(products.products);
    res.json({products: products.products, exist: products.exist(), admin: true});
})

routerProducts.get("/:id", (req, res) =>{
    const {id} = req.params;
    const productSelect = products.getById(parseInt(id));
    console.log(productSelect);
    if(productSelect === null){
        res.json({error: "Producto no encontrado"});
    }else{
        res.json({productSelect, admin: true});
    }
});

routerProducts.delete("/:id", (req, res) =>{
    const {id} = req.params;
    if(isAnAdmin("admin1234")){
        if(isNaN(id)|| id < 1){
            res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
        }else{
            products.deleteById(parseInt(id));
        }
        res.render("listProducts", {products: products.products, exist: products.exist(), admin: true});
    }else{
        res.render("listProducts", {admin: false})
    }
})

routerProducts.post("/", (req, res) =>{
    const {title, price, thumbnail, codigo, stock, descripcion, admin} = req.body;
    console.log(req.body)
    if(isAnAdmin(admin)){
        console.log("Post request done")
        console.log(req.body)
        products.save({
            title: title, 
            price: price, 
            thumbnail: thumbnail,
            codigo: codigo,
            stock: stock,
            codigo: codigo,
            descripcion: descripcion,
        });
        res.send({products: products.products, exist: products.exist(), admin: isAnAdmin(admin)});
    }else{
        res.send({products: products.products, exist: products.exist(), admin: isAnAdmin(admin)})
    }

});

routerProducts.put("/:id", (req, res) =>{
    const {id} = req.params
    const {title, price, thumbnail, codigo, stock, descripcion, admin} = req.body;
    console.log("update")
    if(true){
        if(isNaN(id) && id < 1){
            res.json({"ERROR": "ID ingresado no es numerico o es menor a 1"})
        }else{
            products.save({
                title: title,
                price: price, 
                thumbnail: thumbnail,
                codigo: codigo,
                stock: stock,
                codigo: codigo,
                descripcion: descripcion,
            }, id);
        }
        res.json({products: products.getById(id), exist: products.exist(), admin: isAnAdmin(admin)});
    }else{
        res.json("listProducts", {admin: false})
    }
})

module.exports = routerProducts