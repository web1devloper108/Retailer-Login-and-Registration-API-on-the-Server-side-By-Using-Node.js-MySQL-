const jwt = require('jsonwebtoken');
const connection = require('../Model/model');

const isRetailerLogin = (req, res, next) => {
  const getToken = req.cookies["token"];

  if (getToken) {
    try {
      const verifyToken = jwt.verify(getToken, "1234567");

      const query = "SELECT * FROM tbl_retailer_register WHERE email = ?";
      connection.query(query, verifyToken.email, (err, result) => {
        if (err) {
          res.status(400).json({ message: "Error retrieving retailer information" });
        } else {

          if (result.length > 0) {
            // Retailer found, you can access retailer information
            req.retailerInfo = result[0];
            next();
          } else {
            res.status(404).json({ message: "Retailer not found" });
          }
        }
      });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(400).json({ message: "Retailer not logged in" });
  }
};

module.exports = isRetailerLogin;
