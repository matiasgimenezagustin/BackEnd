//---------------------------------------------------POST REQUEST----------------------------------------------------

//Hare que esto funcione cuando encuentre algun lugar donde lo expliquen
const postProduct = ( req, res ) =>{
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
}



module.exports = postProduct