import { orderService } from './../services/OrderService';
import express, { Request, Response, Router } from 'express'
import { json } from 'stream/consumers';


class OrderController {
    getListOrderbyUser = async (req: Request, res: Response) => {
        const pageSize: number = req.body.pageSize
        const page: number = req.body.page
        const idUser = req.body.idUser
        return res.json(await orderService.getListOrderByUser(pageSize, page, idUser))
    }
    getListOrders = async (req: Request, res: Response) => {
        const pageSize: number = req.body.pageSize
        const page: number = req.body.page
        const search: string = req.body.search
        const sortBy = req.body.sortBy
        const filter = req.body.filter
        console.log(req.body);
        
        return res.json(await orderService.getListOrder(pageSize, page, sortBy, filter, search))
    }
    setStatusOrder = async (req: Request, res: Response) => {

        let nameStatus = req.body.nameStatusOrder
        let idOrder = req.body.idOrder
        await orderService.setStatusOrder(nameStatus, idOrder)
    }
}

export const orderController = new OrderController()