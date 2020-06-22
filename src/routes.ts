import express from 'express';
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

const routes = express.Router()
const pointsController = new PointsController();
const itemsController = new ItemsController();
const upload = multer(multerConfig)

routes.get('/items', itemsController.index)

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            lat: Joi.number().required(),
            long: Joi.number().required(),
            city: Joi.number().required(),
            state: Joi.number().required(),
            items: Joi.string().required()

        })
    }, {
        abortEarly: false
    }),
    pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes