const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const uuid = require('uuid');

const multer = require('multer');
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "..", "static"))
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '.jpg')
    }
})
const upload = multer({ storage: storage })


router.post('/', upload.single('img'), deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);

module.exports = router;