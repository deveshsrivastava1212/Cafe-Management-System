const express = require('express')
const connection = require('../db/connection')
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport',auth.authenticateToken,(req,res)=>{
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = "insert into bill (name,uuid,email,contactNo,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query,[orderDetails.name,generateUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,res.locals.email],(err,results)=>{
        if(!err){
            ejs.renderFile(path.join(__dirname,'',"report.ejs"),{
                productDetails:productDetailsReport,
                name:orderDetails.name,
                email:orderDetails.email,
                contactNumber: orderDetails.contactNumber, 
                paymentMethod: orderDetails.paymentMethod,
                totalAmount:orderDetails.totalAmount
            },(err,results)=>{
                if(err){ 
                    console.log(err); 
                    return res.status(500).json(err);  
                }
                else{
                    pdf.create(results).toFile('./generated_pdf/ '+generateUuid+".pdf",function(err,data){
                        if(err){
                             console.log(err);
                            return res.status(500).json(err);
                        }
                        else{
                            console.log(generateUuid); 
                            return res.status(200).json({uuid: generateUuid});
                        }
                    })
                }
            })
        }else{
            console.log(err);
            return res.status(500).json(err);
        }
    })

})


router.post('/getpdf',auth.authenticateToken,(req,res)=>{
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
    console.log(pdfPath)
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'',"report.ejs"),{
            productDetails:productDetailsReport,
            name:orderDetails.name,
            email:orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod:  orderDetails.paymentMethod,
            totalAmount:orderDetails.total
        },(err,results)=>{
            if(err){ 
                console.log(err); 
               return res.status(500).json(err);  
            }
            else{
                pdf.create(results).toFile('./generated_pdf/ '+orderDetails.uuid+".pdf",function(err,data){
                    if(err){
                         console.log(err);
                        return res.status(500).json(err);
                    }
                    else{
                        
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                        // var readStream = fs.createReadStream(pdfPath);
                        // readStream.on('open', function () {
                        // readStream.pipe(res);
                        // });
                    }
                })
            }
        })
    } 
})


router.get('/getBills',auth.authenticateToken,(req,res)=>{
    var query = "select * from bill order by id DESC";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.delete('/delete/:id',auth.authenticateToken,(req,res)=>{
    const id = req.params.id;
    query = "delete from bill where id =?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({Message: "Bill id does not exist"});
            }
            return res.status(200).json({message: "Bill deleted successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;