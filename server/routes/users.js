const { createComapny, loginCompany } = require("../controller/companyController");

const router = require("express").Router();

router.post("/signup", createComapny);

router.post("/login", loginCompany);

module.exports = router;
