// get the client
const mysql = require('mysql2/promise');

const mySql = 
{
    connection:null,

    init()
    {
        // create the connection to database
        mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            database: process.env.DATABASE,
            port:process.env.PORTDB,
            password:process.env.PASSWORD
        })
        .then((con)=>{
            this.connection = con;

            console.log("The database Is up and running!!!");
        })
        .catch((err)=>console.log(`Error in database : ${err}`))
    }
}
module.exports = mySql;
