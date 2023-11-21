const connection = require("../Model/model");
const jwt = require('jsonwebtoken')
const express = require('express');

const app = express();

///////////Retailer register ////
const addRetailer = async (req, res) => {
    try {
        let sqlQuery = "INSERT INTO tbl_retailer_register SET ?";
        let data = {
            regno: req.body.regno,
            GST_no: req.body.GST_no,
            TIN_no: req.body.TIN_no,
            PAN: req.body.PAN,
            shop_name: req.body.shop_name,
            owner_name: req.body.owner_name,
            contact: req.body.contact,
            mobile: req.body.mobile,
            web: req.body.web,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pin: req.body.pin,
            document_reg_no: req.files[0].location,
            docpan: req.files[1].location,
            docshop: req.files[2].location,
            terms_and_conditions: req.body.terms_and_conditions,
            password: req.body.password,
        };
        await connection.query(sqlQuery, data, function (error, result) {
            if (error) {
                console.log("error", error.sqlMessage);
                res.status(500).json({ error: "Error inserting data" });
            } else {
                res.json(result);
            }
        });
        // console.log('Register') 
        // res.send({values: data})
    } catch (error) {
        console.log("error found...");
        res.status(500).json({ error: "Error processing request" });
    }
};

////////////Retailer login ///

const loginRetailer = (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM tbl_retailer_register WHERE email = ? AND status = 'active'";
    connection.query(query, [email], (err, result) => {
        if (err) {
            res.status(500).json({ data: null, error: err.message });
            console.log(loginRetailer)
        } else {
            if (result.length > 0 && password === result[0].password) {
                const data = {
                    email: result[0].email,
                    regno: result[0].regno
                };

                const option = {
                    expires: new Date(Date.now() + 3 * 24 * 60 * 1000),
                    secure: true,
                    httpOnly: true,
                    sameSite: "none",
                    path: '/'
                };

                const token = jwt.sign(data, "1234567", { expiresIn: "1d" });
                res.status(200).cookie("token", token, option).json({ data: result, token });
            } else {
                res.status(400).json({ message: "Invalid credentials or account deactivated" });
            }
        }
    });
};

// //////   verification  ///


const retailerVerify = (req, res, next) => {
    const token = req.cookies.token
    console.log(req.cookies.token)
    if (!token) {
        return res.json("token missing")
    } else {
        jwt.verify(token, "1234567", (err, result) => {
            console.log(result)
            if (err) {
                return res.json("wrong token")
            } else {
                req.email = result.email
                req.regno = result.regno
                next()
            }
        })
    }
}

////////Retailer logout ///
const logoutRetailer = (req, res) => {
    res.status(200).clearCookie('token', { sameSite: "none", secure: true }).json({ data: null, message: "Logout successful" });
};

module.exports = { addRetailer, loginRetailer, retailerVerify, logoutRetailer }
