import { orderService } from './../services/OrderService';
import express, { Request, Response, Router } from 'express'
import { json } from 'stream/consumers';


class OrderController {
    getListOrder = async (req: Request, res: Response) => {
        const pageSize: number = req.body.pageSize
        const page: number = req.body.page
        const idUser = req.body.idUser
        return res.json(await orderService.getListOrder(pageSize, page, idUser))
    }
}

export const orderController = new OrderController()