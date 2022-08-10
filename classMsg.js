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

class Msg{
    constructor (){
        this.msg = []
    }
    async addMsg(obj){
        this.msg.push(obj);
        await saveArchive("./DB/mensajesDB.txt", this.msg, "Mensaje Guardado");
    }
}

module.exports = Msg