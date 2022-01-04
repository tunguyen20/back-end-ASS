import { User } from './../model/User';
import { cartService } from './../services/CartService';
import { orderProduct } from '../model/Cart'
import express, { Request, Response, Router } from 'express'

class CartController {

    getListCarts = async (req: Request, res: Response) => {
        return res.json(await cartService.getListCart(req.params.idUser))
    }
    addCart = async (req: Request, res: Response) => {
        const orderProduct: orderProduct = req.body.orderProduct
        const idUser = req.params.idUser
        await cartService.addCart(orderProduct, idUser)
        return res.json(1)
    }
    savePlusQuantityProductCart = async (req: Request, res: Response) => {
        await cartService.savePlusQuantityProductCart(req.body.idOrderProduct)
        return res.json(req.body)
    }
    saveMinusQuantityProductCart = async (req: Request, res: Response) => {
        await cartService.saveMinusQuantityProductCart(req.body.idOrderProduct)
        return res.json(req.body)
    }
    deleteProductCart = async (req: Request, res: Response) => {
        await cartService.deleteProductCart(req.body.idOrderProduct)
        return res.json(req.body)
    }
    saveInforUserAndAddOrder = async (req: Request, res: Response) => {
        const user: User = req.body.inforUser
        const idOrder = req.body.idOrder
        await cartService.saveInforUserAndAddOrder(user, idOrder)
        return res.json(req.body)
    }

}

export const cartController = new CartController()

