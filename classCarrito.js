const fs = require("fs");
const getTimestamp = require("./getTimestamp")
const saveArchive = async (rute, content, niceMsg) => {
    try {
        await fs.promises.writeFile(rute, JSON.stringify(content));
        console.log(`NICE: ${niceMsg}`);
    } catch (err) {
        console.log(`ERROR: ${err} el producto no se pudo agregar al carrito`);
    }
};

class carritoClass{
    constructor(){
        this.carrito = [];
        this.counter = 0;
    }
    async createCart(){
        this.counter++;
        this.carrito.push({listProducts: [], id: this.counter, timestamp: getTimestamp()});
        await saveArchive("./DB/carrito.txt", this.carrito, `se añadio un nuevo carrito con ID ${this.counter} exitosamente`);
        return this.counter;
    }
    async deleteById(id){
        this.carrito = this.carrito.filter(carrito => id != carrito.id)
        await saveArchive("./DB/carrito.txt", this.carrito, `se elimino el carrito con ID ${id} exitosamente`)
    }
    getById(id){
        return this.carrito.filter(carrito => carrito.id === id)
    }
    async addProduct(id, product){
        this.carrito.forEach(carrito =>{
            if(carrito.id === id){
                carrito.listProducts.push(product);
            }
        })
        await saveArchive("./DB/carrito.txt", this.carrito, `se añadio un nuevo producto en el carrito ${id} exitosamente`);
    }
    async deleteProduct(id, productId){
        this.carrito.forEach(carrito =>{
            if(carrito.id === id){
                carrito.listProducts = carrito.listProducts.filter(product => product.id !== productId);
            }
        })
        await saveArchive("./DB/carrito.txt", this.carrito, `se elimino del carrito con ID: ${id}, el producto con ID: ${productId} exitosamente`);
    }
}

module.exports = carritoClass

