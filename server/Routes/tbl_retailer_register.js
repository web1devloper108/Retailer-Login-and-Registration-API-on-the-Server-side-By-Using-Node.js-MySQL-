const express = require('express')
const Retailer = express.Router();

const { addRetailer, loginRetailer, retailerVerify, logoutRetailer } = require("../Controller/tbl_retailer_register")
const isRetailerLogin = require('../middleware/isLoggin')
let multerS3 = require('multer-s3');
let multer = require("multer")
const { S3Client } = require('@aws-sdk/client-s3');

const bucketName = "forimg123456";
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "write here accessKeyId",
        secretAccessKey: "write here secretAccessKey"
    }
})

//Storage Configuraion
let storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        cb(null, file.originalname)
    }

})
let upload = multer({ storage: storage })


Retailer.post("/api/retailer/newshopregister", upload.array("images", 3), addRetailer);

//////login///////                              
Retailer.post("/api/retailer/login", loginRetailer);
// Retailer.get("/api/retailer/verify",isRetailerLogin, retailerVerify );                     
Retailer.get("/api/retailer/logout", logoutRetailer);
Retailer.get("/api/retailer/verify", isRetailerLogin, retailerVerify, (req, res) => {
    return res.json({ email: req.email, regno: req.regno });
});

module.exports = { Retailer }
