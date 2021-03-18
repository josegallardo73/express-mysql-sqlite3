import  { mysql } from './mysql.config';
import { sqlite } from './sqlite3.config';
import knex from 'knex';
const mysqlConn = knex(mysql);
const sqliteConn = knex(sqlite);

// Descomentar para crear la tabla productos en el servidor mysql y volver a comentar.

/* mysqlConn.schema.createTable('productos', table => {
    table.increments('id');
    table.string('title');
    table.integer('price');
    table.string('thumbnail');
})
    .then(() => console.log('Table created!'))
    .catch((err) => console.log(err))
    .finally(() => mysqlConn.destroy()); */

export class BD {

    private engine:any;
    private name:string;

    constructor (engine:string, name:string) {
        this.engine = (engine == 'mysql') ? mysqlConn : sqliteConn;
        this.name = name;
    }

    getAll = async () => {
        let response = null;
        try {
            response = await this.engine(this.name).select('*')
            
        }catch(err) {
            throw err;
        }
        return response;
    }

    getOne = async (id:number) => {
        let response = null;
        try{
            response = await this.engine(this.name).select('*').where('id', id);
        }catch(err) {
            throw err;
        }
        return response;
    }

    getLast = async () => {
        let response = null;
        try {
            response = await this.engine(this.name).select('title','price', 'thumbnail').orderBy('id', 'desc').limit(1);
           
        }catch(err) {
            throw err;
        }
        return response;
    }

    set = async (item:any) => {
        let response = null;
        try {
            response = await this.engine(this.name).insert(item);
        }catch(err) {
            throw err;
        }
        return response;
    }

    update = async (item:any) => {
        
        let response = null;
        try {
            if(item.thumbnail) {
                const { id, title, price, thumbnail } = item;
                response = await this.engine(this.name).where('id', id).update({ title, price, thumbnail });
            } else {
                const {id, message, email, datetime} = item;
                response = await this.engine(this.name).where('id', id).update({message, email, datetime})
            }  
        }catch(err) {
            throw err;
        }
        return response;
    }

    delete = async (id:number) => {
        let response = null;
        try {
            response = await this.engine(this.name).where('id',id).del();
            
        }catch(err) {
            throw err;
        }
        return response;
    } 
}




