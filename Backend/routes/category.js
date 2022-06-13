
const express = require('express');
const connection = require('../db/connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Category added successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken,(req,res,next)=>{
    query = "select * from category order by name";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let newProduct = req.body;
    query = 'update category set name=? where id=?';
    connection.query(query,[newProduct.name,newProduct.id],(err,results)=>{
        if(!err){
            if(results.length<=0)
                return res.status(404).json({message:"Category ID Does not found"})
            return res.status(200).json({message:"Category Updated Successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let id = req.body.id;
    query = "delete from category where id = ?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                console.log(err)
                return res.status(404).json({Message:"Category ID does not exist"});
            }
            return res.status(200).json({Message:"Deleted Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;