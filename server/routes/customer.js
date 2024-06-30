const Router = require('express').Router;
const {createCustomer, loginCustomer,sendOtp,getBalance,sendMoney,getAll} = require('../controller/customerController');

const router = Router();

router.post('/customer/create', createCustomer);
router.post('/customer/login', loginCustomer);
router.post('/sendotp', sendOtp);
router.get('/getbalance', getBalance);
router.post('/sendmoney', sendMoney);
router.get('/getall', getAll);
module.exports = router;
