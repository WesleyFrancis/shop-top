const db = require("../config/mysqlDAO.js");//! Might not work connect to dbconsole.
// const User = require("../POJO/user.js");
 //db.init();
const userModel ={
    Sql:"",
    addUser(UserObj)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `INSERT into user(firstName,lastName,email,password,imgPath,role)VALUES(?,?,?,?,?,?)`;
        db.connection.query(this.Sql,[UserObj.firstName,UserObj.lastName,UserObj.email,UserObj.password,"img/default.jpg","user"])
        .then(()=>{
            resolve();
        })
        .catch((err)=>reject(err))
        })
    },
    deleteUser()
    {

    },
    getUserById(user_id)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `SELECT * FROM user where userId = ?`;
        db.connection.query(this.Sql,[user_id])
        .then(([rows,fields])=>{
            resolve(rows,fields);
        })
        .catch((err)=>reject(err))
        })
    
    },
    getUserFromLogin(email)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `SELECT * FROM user WHERE email = ?`;
        db.connection.query(this.Sql,[email])
        .then(([rows,fields])=>{
            resolve(rows);
        })
        .catch((err)=>reject(err))
        })
    },
    getCustomerInfo(user_id)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `SELECT * FROM customer where userId = ?`;
        db.connection.query(this.Sql,[user_id])
        .then(([rows,fields])=>{
            resolve(rows);
        })
        .catch((err)=>reject(err))
        })
    
    },

}

module.exports = userModel;