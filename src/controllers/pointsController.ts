import knex from '../database/connection'
import { Request, Response, request } from 'express'

class PointsController {

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            lat,
            long,
            city,
            state,
            items
        } = req.body

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            lat,
            long,
            city,
            state
        }


        try {
            const trx = await knex.transaction(async (trx) => {
                const newPointId = await trx('points').insert(point)
                const point_id = newPointId[0]

                const pointItems = items
                    .split(',')
                    .map((item: string) => Number(item))
                    .map((item_id: number) => {
                        return {
                            item_id,
                            point_id
                        }
                    })

                await trx('point_items').insert(pointItems)

                return res.json({
                    id: point_id,
                    ...point
                })

            })

        } catch (error) {
            console.log(`${error}`)
        }

    }

    async show(req: Request, res: Response) {
        const { id } = req.params
        const point = await knex('points').where('id', id).first()
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)

        if (!point) return res.status(400).json({ msg: 'Point not found' })

        const serializedPoint =
        {
            ...point,
            image_url: `http://192.168.0.14:3333/images/${point.image}`
        }

        return res.json({
            point: serializedPoint,
            items
        })


    }

    async index(req: Request, res: Response) {
        const {
            city,
            state,
            items
        } = req.query

        const parsedItems = String(items)
            .split(",")
            .map(item => Number(item.trim()))


        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('state', String(state))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.14:3333/images/${point.image}`
            }
        })

        return res.json(serializedPoints)
    }

}

export default PointsController