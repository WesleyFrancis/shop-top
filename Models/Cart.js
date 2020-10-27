const db = require("../config/mysqlDAO.js");//! Might not work connect to dbconsole.

const cartModel = {
    SQL:"",
    addToCart(cartInfo)
    {
        return new Promise ((resolve,reject)=>{
            this.SQL="INSERT INTO cart (productCode,customerId,quantity) VALUES(?,?,?)"
            db.connection.query(this.SQL,[cartInfo.productCode,cartInfo.customerId,cartInfo.quantity])
            .then(()=>{
                resolve();
            })
            .catch((e) => {reject(e)})
        })
    },
    getcartItems(userId)
    {
        return new Promise ((resolve,reject)=>{
            this.SQL="SELECT * FROM cart WHERE customerId=?"
            db.connection.query(this.SQL,[userId])
            .then((rows,fields)=>{
                resolve(rows);
            })
            .catch((e) => {reject(e)})
        })
    },
    addNewCard(crd,userId){
        return new Promise ((resolve,reject)=>{
            this.SQL="INSERT INTO card_info (userId,binCategory,cardSubType,ccBin,ccType,exp,isRegulated,issuingcountry,last4digits) VALUES (?,?,?,?,?,?,?,?,?)"
            db.connection.query(this.SQL,[userId,crd.binCategory,crd.cardSubType,crd.ccBin,crd.ccType,crd.exp,crd.isRegulatedCard,crd.issuingCountry,crd.last4Digits])
            .then(()=>{
                resolve({message:"success"});
            })
            .catch((e) => {reject(e)})
        })
    },
    getCards(userid){
        return new Promise ((resolve,reject)=>{
            this.SQL = "SELECT * FROM card_info WHERE userId = ?";
            db.connection.query(this.SQL,[userid])
            .then((rows,fields)=>{
                resolve(rows);
            })
            .catch((e)=>{
                console.warn(e);
            })
        })
    }
}

module.exports = cartModel;