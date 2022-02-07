import { productController } from './../controller/ProductController';
import { cartController } from './../controller/CartController';
import { Router } from "express";
import { orderController } from "../controller/OrderController";

import { userController } from "../controller/UserController";
const jwt = require('jsonwebtoken');
import express, { Request, Response } from 'express'

const verify = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send("Vui lòng đăng nhập để được truy cập")
    try {
    jwt.verify(token, "passUser")
   
        next()
    } catch (error) {
        res.status(401).send('Token không hợp lệ')
    }
}
const verifyAdmin = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).send("Vui lòng đăng nhập để được truy cập")
    try {
      let a=   jwt.verify(token, "passUser")
        if(a.roles!="admin"){
            res.status(403).send('Token không hợp lệ')
        }
        next()
    } catch (error) {
        res.status(403).send('Token không hợp lệ')
    }
}



const router = Router()



router.post('/products', productController.getListProductWithPagination)
router.post('/products-admin',verifyAdmin, productController.getListProductWithPagination)
router.post('/add-products', productController.addBook)
router.get('/get-list-category', productController.getListCategory)
router.get('/get-list-publisher', productController.getPublisher)
router.get('/book/:id', productController.getProductDetail)
router.delete('/delete-book/:id', productController.deleteBook)

router.post('/check-login', userController.checkLogin)

router.get('/get-me', verify, userController.getMe)


router.post('/add-cart/:id', cartController.addCart)
router.get('/cart/:id', verify, cartController.getListCarts)
router.post('/save-plus-quantity-book-cart', verify, cartController.savePlusQuantityBookCart)
router.post('/save-minus-quantity-book-cart', verify, cartController.saveMinusQuantityBookCart)
router.post('/delete-book-cart', verify, cartController.deleteBookCart)

router.post('/checkout', cartController.saveOrder)
router.post('/product/search', productController.getListBookSearchWithPagination)
router.post('/orders', verify, orderController.getListOrder)

export default router;