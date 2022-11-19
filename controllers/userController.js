require('dotenv').config();
const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket} = require('../models/models');

function jwtGenerate(id, email, role) {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
        )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('Не указана почта или пароль'))
        }
        const candidate = await User.findOne({
            where: {
                email
            }
        })
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword, role})
        const basket = await Basket.create({userId: user.id})
        const token = jwtGenerate(user.id, email, role)

        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return next(ApiError.badRequest('Пользователь с таким email не найден'));
        }
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверные пароль'));
        }

        const token = jwtGenerate(user.id, user.email, user.role)

        return res.json({token})
    }
    async check(req, res, next) {
        const token = jwtGenerate(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()