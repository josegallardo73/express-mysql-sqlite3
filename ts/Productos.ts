import { BD } from './bd/bd';

const bd = new BD('mysql', 'productos');

export interface Producto  {
    title: string;
    price: number;
    thumbnail: string;
    id: number;
}

export class Productos {
    
    getAll = async () => {
        let response = null;
        try {
            response = await bd.getAll()
            
        }catch(err){
            throw err;
        }
        return response;
    }

    getProduct = async (id:number) => {
        let response = null;
        try {
            response = await bd.getOne(id);
            
        }catch(err ) {
            throw err;
        }
        return response;
    }


    getLastProduct = async () => {
        let response = null;
        try {
            response = await bd.getLast();
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    setProduct = async (producto:Producto) => {
        
        let response = null;
        try {
            response = await bd.set(producto);
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    updateProduct = async (producto:Producto) => {

        const {id, title, price, thumbnail} = producto;
        let response = null;
        try {
            response = await bd.update(producto);
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    deleteProduct = async (id:number) => {
        let response = null;
        try {
            response = bd.delete(id);
            
        }catch(err) {
            throw err;
        }
        return response;
    }
   
}