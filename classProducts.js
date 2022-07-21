const fs = require("fs");

// Funcion asincrona de guardado de archivos
const saveArchive = async (rute, content, niceMsg) => {
    try {
        await fs.promises.writeFile(rute, JSON.stringify(content));
        console.log(`NICE: ${niceMsg}`);
    } catch (err) {
        console.log(`ERROR: ${err}`);
    }
};


//Funcion para poder leer archivos de forma asincrona
const readArchive = async (rute) => {
    try{
        const readContent = await fs.promises.readFile(rute, "utf-8");
        console.log(readContent)
    }
    catch(err){
        console.log(err)
    }
}

class ProductsClass {
    constructor() {
        this.products = [];
        this.counter = 0;
    }
    getById(id) {
        const filterResult = this.products.filter((content) => content.id === id);
        return filterResult.length === 1 ? filterResult : (filterResult = null);
    }
    async save(object, id) {
        if (isNaN(id)) {
            this.counter++;
            object.id = this.counter;
        } else {
            this.deleteById(id);
            object.id = id;
        }
        this.products.push(object);
        await saveArchive("./productos.txt", this.products, `el producto con ID ${this.counter} se guardo exitosamente`);
    }
    async deleteById(id) {
        const map = this.products.filter((content) => content.id !== id);
        this.products = map;
        await saveArchive("./productos.txt", map, `se elimino el producto con ID: ${id} exitosamente`);
    }
} 

module.exports = ProductsClass