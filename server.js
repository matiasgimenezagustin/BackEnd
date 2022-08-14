

// Error catching endware.
/* server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});
 */





// Express Config
const express = require("express");
const classPoducts = require("./classProducts");
const mens = require("./classMsg")
const app = express();
const PORT = 8080;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Websocket Configs
const events = require("./socketEvents");
const { Server: SocketServer } = require ("socket.io");
const {Server:HTTPServer} = require("http");
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);



const products = new classPoducts();
const mensajes = new mens()

//Middleware que activa mi router 
/* const routerProducts = require("./routes/products.js") */
/* app.use("/products", routerProducts); */

// Handlebars configs 
const handlebars = require("express-handlebars");
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/public/viewsHandlebars/layouts",
    partialsDir: __dirname + "/public/viewsHandlebars/partials/"
})
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs");
app.set("views", "./public/viewsHandlebars")


//socket 

app.get("/", (req, res) =>{
    console.log(products.products);
    res.render("products");
})
/* app.post("/", (req, res) =>{

    console.log("Post request done")
    const {title, price, thumbnail} = req.body;
    products.save({
        title: title, 
        price: price, 
        thumbnail: thumbnail
    });
    res.render("products", {products: products.products, exist: products.exist()});
}); */

socketServer.on("connection", (socket) =>{
    console.log("usuario conectado")
    socketServer.emit(events.UPDATE_PRODUCT, {products: products.products, exist: products.exist()})

    socketServer.sockets.emit(events.UPDATE_PRODUCT, {products: products.products, exist: products.exist()})
    //chat de la app
    socketServer.sockets.emit(events.INIT, mensajes.msg) 

    socket.on(events.POST_MENSAJE, (msg) =>{
        const newMsg = {...msg, id: socket.id}
        mensajes.addMsg(newMsg)
        socketServer.sockets.emit(events.NEW_MENSAJE, mensajes.msg)
    })

    socket.on(events.POST_PRODUCT, (product) =>{
        console.log("nuevo producto posteado")
        products.save(product)
        socket.emit(events.UPDATE_PRODUCT, {products: products.products, exist: products.exist()})
    })
})


//Listener server
httpServer.listen(PORT, ()=>{
    console.log(`Exito: El servidor se esta escuchando en el puerto ${PORT}`);
});


