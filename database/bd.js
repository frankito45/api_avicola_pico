// db.js
import mysql from "mysql2/promise";

class MySQLDatabase {
    constructor(config) {
        // Crear pool de conexiones (lo correcto para producción)
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.USER_DB,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT),

            waitForConnections: true,
            connectionLimit: 10,   // cantidad de conexiones simultáneas
            queueLimit: 0,

            ssl: { rejectUnauthorized: false }
        });

        console.log("Pool MySQL inicializado");
    }

    // Ejecutar consulta SQL (SELECT, INSERT, UPDATE...)
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (err) {
            console.error("Error en query:", err.message);
            throw err;
        }
    }

    // Cerrar el pool
    async close() {
        try {
            await this.pool.end();
            console.log("Pool MySQL cerrado");
        } catch (err) {
            console.error("Error cerrando pool:", err.message);
        }
    }
}

const db = new MySQLDatabase({
    host: process.env.HOST_BD ,
    user: process.env.USER ,
    password: process.env.PASSWORD_BD ,
    database: process.env.DATABASE ,
    port: parseInt(process.env.PORT_BD) 
});

export default db;
