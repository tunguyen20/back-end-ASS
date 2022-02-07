import { Carts, orderBook } from './../model/Cart';
import { User } from './../model/User';
import { cartService } from './../services/CartService';

import express, { Request, Response, Router } from 'express'

class CartController {

    getListCarts = async (req: Request, res: Response) => {
        console.log(req.params.id);
        
        return res.json(await cartService.getListCart(req.params.id))
    }
    addCart = async (req: Request, res: Response) => {
        const orderProduct: orderBook = req.body.orderBook
        await cartService.addCart(orderProduct)
        return res.json(1)
    }
    savePlusQuantityBookCart = async (req: Request, res: Response) => {
        await cartService.savePlusQuantityBookCart(req.body.idOrderBook)
        return res.json(req.body)
    }
    saveMinusQuantityBookCart = async (req: Request, res: Response) => {
        await cartService.saveMinusQuantityBookCart(req.body.idOrderBook)
        return res.json(req.body)
    }
    deleteBookCart = async (req: Request, res: Response) => {
        await cartService.deleteBookCart(req.body.idOrderBook)
        return res.json(req.body)
    }
    saveOrder = async (req: Request, res: Response) => {
    
      const  orderBook:Carts=(req.body.Carts);
      const  userInfor:User=(req.body.userInfor);
        console.log(orderBook);
        
        await cartService.savedOrder(userInfor, orderBook)
        // return res.json(req.body)
    }

}

export const cartController = new CartController()

