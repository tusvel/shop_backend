const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const deviceRouter = require('./deviceRouter');
const typeRouter = require('./typeRouter');
const brandRouter = require('./brandRouter');


router.use('/users', userRouter);
router.use('/device', deviceRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);

module.exports = router;