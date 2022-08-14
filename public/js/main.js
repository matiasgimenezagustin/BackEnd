
const socket = io();

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on("UPDATE_PRODUCT", (products) => {
  const url = "http://localhost:8080/viewsHandlebars/listProducts.hbs";
    fetch(url).then((resp) => {
      return resp.text();
  }).then((text) => {
    const template = Handlebars.compile(text);
    const html = template({products: products.products, exist: products.exist});
    document.getElementById("postsProducts").innerHTML = html;
  });
})


socket.on("INIT", (allMsg)=>{
  const url= "http://localhost:8080/viewsHandlebars/msg.hbs"
    fetch(url).then((resp) =>{
      console.log(resp);
      return resp.text()
    }).then((text)=>{
      const template = Handlebars.compile(text)
      const html = template({allMsg: allMsg})
      document.getElementById("postsMsg").innerHTML = html
    })
})

socket.on("NEW_MENSAJE", (allMsg) =>{
  const url= "http://localhost:8080/viewsHandlebars/msg.hbs"
    fetch(url).then((resp) =>{
      return resp.text()
    }).then((text)=>{
      const template = Handlebars.compile(text)
      const html = template({allMsg: allMsg})
      document.getElementById("postsMsg").innerHTML = html
    })
})

const getNewDate = () =>{
  const date = new Date()
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}]`
}
function enviarMensaje(){
  const email = document.getElementById("email").value;
  const content = document.getElementById("contentMsg").value;
  socket.emit("POST_MENSAJE", {email, content, date: getNewDate()})
}


function addProduct(){
  const title = document.getElementById("title").value
  const price = document.getElementById("price").value
  const thumbnail = document.getElementById("thumbnail").value
  console.log(title, price, thumbnail)
  socket.emit("POST_PRODUCT", {title:title, price:price, thumbnail:thumbnail})
}