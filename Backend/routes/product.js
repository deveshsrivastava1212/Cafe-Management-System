
const express = require('express')
const connection = require('../db/connection');
const auth = require('../services/authentication')
const checkRole = require('../services/checkRole')

const router = express.Router();

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let product = req.body;
    query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Product Added Successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
})


router.get('/get',auth.authenticateToken,(req,res,next)=>{
    query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    })
})


router.get('/getByCategory/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    query = "select id, name from product where categoryId =? and status ='true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0)
                return res.status(404).json({message:"Product ID does not exist"})
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/getById/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    query = "select id,name,description,price from product where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0)
                return res.status(404).json({message:"Product does not exist"})
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    })

})


router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    query = "update product set name =?,categoryId=?,description=?,price=? where id=?";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"Product Not Found"});
            }
            return res.status(200).json({message:"Product Updated Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})


router.delete('/delete/:id', auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let id = req.params.id;
    query = "delete from product where id =?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"Sorry, Product ID is not found"});
            }
            return res.status(200).json({message:"Product Deleted Successfully"})
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let info = req.body;
    query = "update product set status=? where id =?";
    connection.query(query,[info.status,info.id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0)
                return res.status(404).json({message:"Product does not found"});
            return res.status(200).json({message:"Status of that product has been changed successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;