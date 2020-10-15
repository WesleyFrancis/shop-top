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
    addNewCard(crd,userId,vaultedShopperId){
        return new Promise ((resolve,reject)=>{
            this.SQL="INSERT INTO card_info (userId,vaultedShopperId,binCategory,cardSubType,ccbin,ccType,exp,isregulated,issuingCountry,last4digits) VALUES (?,?,?,?,?,?,?,?,?)"
            db.connection.query(this.SQL,[userId,vaultedShopperId,crd.binCategory,crd.cardSubType,crd.ccbin,crd.ccType,crd.exp,crd.isregulated,crd.issuingCountry,crd.last4digits])
            .then(()=>{
                resolve({message:"success"});
            })
            .catch((e) => {reject(e)})
        })
    }
}

module.exports = cartModel;