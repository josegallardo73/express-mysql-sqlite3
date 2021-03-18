const fs = require('fs').promises;
import { BD } from './bd/bd';

const bd = new BD('sqlite3', 'mensajes');

export class Chat {
    

    getAll= async () => {
        let response = null;
        try {
            response = await bd.getAll()
            
        }catch(err){
            throw err;
        }
        return response;
    }

    getMessage = async (id:number) => {
        
        let response = null;
        try {
            response = await bd.getOne(id);
        }catch(err ) {
            throw err;
        }
        return response;
    }

    setMessage = async (message:object) => {
        
        let response = null;
        try {
            response = await bd.set(message);
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    updateMessage = async (message:object) => {

        let response = null;
        try {
            response = await bd.update(message);
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    deleteMessage = async (id:number) => {
        let response = null;
        try {
            response = bd.delete(id);
            
        }catch(err) {
            throw err;
        }
        return response;
    }
}