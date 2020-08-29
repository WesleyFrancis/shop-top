const db = require("../config/mysqlDAO.js");//! Might not work connect to dbconsole.
// const User = require("../POJO/user.js");
 db.init();
const userModel ={
    Sql:"",
    addUser(UserObj)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `INSERT into user(firstName,lastName,email,password,imgPath)VALUES(?,?,?,?,?)`;
        db.connection.query(this.Sql,[UserObj.firstName,UserObj.lastName,UserObj.email,UserObj.password,"default.jpg"])
        .then(()=>{
            resolve();
        })
        .catch((err)=>reject(err))
        })
    
    },
    deleteUser()
    {

    },
    getUser(user_id)
    {
        return new Promise((resolve,reject)=>{
            this.Sql = `SELECT * FROM user where userId = ?`;
        db.connection.query(this.Sql,[user_id])
        .then(([rows,fields])=>{
            resolve(rows,fields);
        })
        .catch((err)=>reject(err))
        })
    
    }

}

module.exports = userModel;