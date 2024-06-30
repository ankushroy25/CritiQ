const Router = require('express').Router;
const {createPhone, getPhone} = require('../controller/phoneController');

const router = Router();

router.get('/getphone', getPhone);
router.post('/createphone', createPhone);

module.exports = router;