const db = require("../config/mysqlDAO.js");//! Might not work connect to dbconsole.

const productModel ={
    SQL : "",
    addProduct(p)
    {
        
        return new Promise((resolve,reject)=>{
            this.SQL = `INSERT INTO product (min,max,price,quantity,costPrice,title,description,categoryId,descriptionDocxPath,imgLocation,likes)VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
            db.connection.query(this.SQL,[p.min,p.max,p.price,p.quantity,p.costPrice,p.title,p.description,p.categoryId,p.descriptionDocxPath,p.imgLocation,p.likes])
            .then(()=>{
                resolve();
            })
            .catch((err)=>reject(err))
        })
    },
    deleteProductById(prodId)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `DELETE FROM product WHERE productCode = ?`;
            db.connection.query(this.SQL,[prodId])
            .then(([rows,fields])=>{
                resolve(rows);
            })
            .catch((err)=>reject(err))
        })
    },
    getProductById(prodId)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `SELECT * FROM product WHERE productCode = ?`;
            db.connection.query(this.SQL,[prodId])
            .then(([rows,fields])=>{
                resolve(rows);
            })
            .catch((err)=>reject(err))
        })
    },
    getAllProducts()
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `SELECT * FROM product WHERE productCode > 0 ORDER BY productCode desc`;
            db.connection.query(this.SQL)
            .then(([rows,fields])=>{
                resolve(rows);
            })
            .catch((err)=>reject(err))
        })
    },
    addToWatchLater(userId,productId)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `INSERT INTO watch_later (customerId,productCode)VALUES(?,?)`;
            db.connection.query(this.SQL,[userId,productId])
            .then(()=>{
                resolve();
            })
            .catch((err)=>{
                reject(err);
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
    },
    getCategoryById(id)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `SELECT * FROM category Where categoryId = ?`;
            db.connection.query(this.SQL,[id])
            .then(([rows,feilds])=>{
                resolve(rows);
            })
            .catch((err)=>{reject(err)})
        })
    },
    getWatchLater(User_id)
    {
        return new Promise((resolve,reject)=>{
            this.SQL = `SELECT * FROM watch_later Where customerId = ?`;
            db.connection.query(this.SQL,[User_id])
            .then(([rows,feilds])=>{
                resolve(rows);
            })
            .catch((err)=>{reject(err)})
        })
    }
}

module.exports = productModel;

