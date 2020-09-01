const db = require("../config/mysqlDAO.js");//! Might not work connect to dbconsole.

const productModel ={
    SQL : "",
    addProduct(product)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `INSERT INTO products ()VALUES()`;
            db.connection.query(this.SQL,[])
            .then(()=>{
                resolve();
            })
            .catch((err)=>reject(err))
        })
    },
    deleteProduct(){},
    getProduct(){},
    getAllProducts(){},
    addToWatchLater(userId,productId)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `INSERT INTO watch_later (customerId,productCode)VALUES(?,?)`;
            db.connection.query(this.SQL,[userId,productId])
            .then(()=>{
               const added = {success:true};
                resolve(added);
            })
            .catch((err)=>{
               const added = {success:"failed to insert Watchlater"}
                reject(err,added);
            })
        })
    },
    addCategory(){},
    getAllCategory()
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `SELECT * FROM category Where 1`;
            db.connection.query(this.SQL)
            .then(([rows,feilds])=>{
                resolve(rows);
            })
            .catch((err)=>{reject(err)})
        })
    }
}

module.exports = productModel;

