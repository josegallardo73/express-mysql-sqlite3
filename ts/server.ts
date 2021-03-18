import express from 'express';
import { Productos, Producto } from './Productos';
import { Chat } from './Chat';
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const routerProductos = express.Router();
const routerMensajes = express.Router();
const PORT = '8080'

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const consolas = new Productos();
const chatMessages  = new Chat();

app.use('/api/productos', routerProductos);
app.use('/api/mensajes', routerMensajes);

app.use('/',express.static(__dirname + '/public'));


app.get('/api', (req, res) => {
    res.send('Punto de entrada de la aplicación');
});

routerProductos.get('/list', async(req, res) => {
    try {
        await res.render('index.pug',{
            products: await consolas.getAll()
        });
    }catch(err) {
        console.log(err)
    }
});

routerProductos.get('/', async (req, res) => {
    try{
        const productos = await consolas.getAll()
        if(productos.length > 0) res.json(productos);
        else res.json({ info: 'No hay productos actualmente' });
    }catch(err){
        console.log(err);
    }
});

routerProductos.get('/:id', async (req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        const producto = await consolas.getProduct(id);
        if(!producto) res.json({error: 'Producto no encontrado'})
        else res.json(producto);
    }catch(err) {
        console.log(err);
    }   
});

function validar (req:any, res:any, next:any):void {
    if(req.body.title === '' 
    || req.body.price === '' 
    || req.body.thumbnail === '') {
        res.send('No se completaron todos los campos del formulario');
        
    } else {
        req.body.price = parseInt(req.body.price);
        next();
    }
}

routerProductos.post('/add', validar , async (req, res) => {
    
    try {
        const producto = await req.body;
        
        const response = await consolas.setProduct(producto);
        if(response) {
            res.writeHead(301,
                { Location: 'http://localhost:8080/'} );
            res.end();
        }
    }catch(err) {
        console.log(err)
    }   
})

routerProductos.post('/', async (req, res) => {
    try{
        const producto = await req.body;
        const response = consolas.setProduct(producto);
        if(response) res.json({success: 'Producto insertado correctamente'});
    }catch(err) {
        console.log(err);
    } 
    
})

routerMensajes.get('/', async (req, res) => {
    try{
        const mensajes = await chatMessages.getAll()
        if(mensajes.length > 0) res.json(mensajes);
        else res.json({ info: 'No hay mensajes actualmente' });
    }catch(err){
        console.log(err);
    }
});

routerMensajes.get('/:id', async (req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        let response = await chatMessages.getMessage(id);

        if(!response.length) res.json({error: 'mensaje no encontrado'});
        else  {
            const {id, message, email, datetime} = response[0]
            response = {
                id,
                message,
                email,
                datetime,
            }
            res.json(response);
        }
    }catch(err) {
        console.log(err);
    }   
});

const buildDate = () => {
            
    const f = new Date();
    const day = f.getDate();
    const month = f.getMonth() + 1;
    const year = f.getFullYear();
    const date = `${day}/${month}/${year}`
    const hours = f.getHours();
    const minutes = f.getMinutes();
    const seconds = f.getSeconds() < 10 ? "0" + f.getSeconds() : f.getSeconds();
    const time = `${hours}:${minutes}:${seconds}`;

    return `${date} ${time}`;
}

routerMensajes.post('/', async (req, res) => {
    const datetime = buildDate();
    try{
        let mensaje = await req.body;
        mensaje = {
            message:req.body.message,
            email: req.body.email,
            datetime: datetime
        }
        const response = chatMessages.setMessage(mensaje);
        if(response) res.json({success: 'Mensaje insertado correctamente'});
    }catch(err) {
            console.log(err)    
    }
});

routerMensajes.put('/:id', async (req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        const mensaje = await chatMessages.getMessage(id);
        if(!mensaje) res.json({error: 'Mensaje no encontrado'});
        else {
            const mensajeUpdated = {
                id: id,
                message: req.body.message,
                email: req.body.email,
                datetime: req.body.datetime
            }
            const response = await chatMessages.updateMessage(mensajeUpdated);
            if(response) res.json({success: 'Mensaje actualizado correctamente'});
        }
    }catch(err) {
        console.log(err)
    }
})

routerMensajes.delete('/:id', async(req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        const mensaje = await chatMessages.getMessage(id);
        if(!mensaje.length) res.json({error: 'Mensaje no encontrado'});
        else {
            const response = await chatMessages.deleteMessage(id);
            if(response) 
            res.json({ message: 'Producto eliminado', mensaje: mensaje })} 
    }catch(err) {
        console.log(err);
    }
})


routerProductos.put('/:id', async (req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        const producto = await consolas.getProduct(id);
        if(!producto) res.sendStatus(404);
        else {
            const productoUpdated = {
                id: id,
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail
            }
            const response = await consolas.updateProduct(productoUpdated);
            if(response) res.json({success: 'Producto actualizado correctamente'});
        }
    }catch(err) {
        console.log(err)
    }
})

routerProductos.delete('/:id', async(req, res) => {
    try {
        const id:number = await parseInt(req.params.id);
        const producto = await consolas.getProduct(id);
        if(!producto) res.json({ error: 'Producto no encontrado' });
        else {
            const response = await consolas.deleteProduct(id);
            if(response) 
            res.json({ message: 'Producto eliminado', producto: producto })} 
    }catch(err) {
        console.log(err);
    }
})

io.on('connection', (socket:any) => {
    
    socket.emit('server message', 'conexión establecida');

    socket.on('nuevo producto', async (producto:Producto) => {

        const create = await consolas.setProduct(producto);
        if(create) {
            const response = await consolas.getLastProduct();
            const {id ,title, price, thumbnail} = response[0];
            const lastProducto = {id, title, price, thumbnail}
            io.emit('nuevo producto', lastProducto); 
        }
    });

    socket.on('nuevo mensaje', (message:object) => {
        
        chatMessages.setMessage(message);
        io.sockets.emit('messages', chatMessages.getAll());
    })
});

http.listen(PORT, () => console.log('Server listening in port ', PORT));