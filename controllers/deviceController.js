const {Device, DeviceInfo} = require('../models/models');
const path = require('path');
const ApiError = require("../error/ApiError");

class DeviceController {
    async create(req, res, next) {
        let {name, price, brandId, typeId, info} = req.body
        const img = req.file.filename
        const device = await Device.create({name, price, brandId, typeId, img});
        if (info) {
            info = JSON.parse(info)
            info.forEach(i =>
                DeviceInfo.create({
                    title: i.title,
                    desc: i.description,
                    deviceId: device.id
                })
            )
        }
        // req.file.filename - имя с расширением
        return res.json(device)
    }
    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query;
        limit = limit || 9;
        page = page || 1;
        let offset = page * limit - limit;
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({
                limit,
                offset
            });
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: {
                    typeId
                },
                limit,
                offset
            });
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({
                where: {
                    brandId
                },
                limit,
                offset
            });
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({
                where: {
                    brandId,
                    typeId
                },
                limit,
                offset
            });
        }

        return res.json(devices);
    }
    async getOne(req, res) {
        const {id} = req.params;
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )

        return res.json(device);
    }
}

module.exports = new DeviceController();