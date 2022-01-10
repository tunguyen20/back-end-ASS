import { Router } from "express";
import { cartController } from "../controller/CartController";
import { orderController } from "../controller/OrderController";
import { productController } from "../controller/ProductController";
import { userController } from "../controller/UserController";
const jwt = require('jsonwebtoken');
import express, { Request, Response } from 'express'

const verify = (req: Request, res: Response, next: any) => {
    const token = req.header('Authorization');
   
    
    if (!token) return res.status(403).send("Vui lòng đăng nhập để được truy cập")
    try {
       jwt.verify(token, "passUser")
        // req.user = checkToken;
        next()
    } catch (error) {

        res.status(403).send('Token không hợp lệ')
    }
}

const router = Router()

//products 
router.post('/products',verify, productController.getListProductWithPagination)
router.post('/products/add', productController.addProduct)
router.delete('/products/delete/:id', productController.deleteProduct)
router.put('/products/edit/:id', productController.updateProduct)
router.get('/products/:id',verify, productController.getProductDetail)

//cart
router.get('/cart/:idUser',verify, cartController.getListCarts)
router.post('/add-cart/:idUser',verify, cartController.addCart)
router.post('/save-plus-quantity-product-cart',verify, cartController.savePlusQuantityProductCart)
router.post('/save-minus-quantity-product-cart', verify,cartController.saveMinusQuantityProductCart)
router.post('/delete-product-cart',verify, cartController.deleteProductCart)

router.post('/checkout',verify, cartController.saveInforUserAndAddOrder)

router.get('/get-infor-user/:idUser', userController.getInforUser)
router.post('/historyorders/',verify, orderController.getListOrder)

router.post('/login', userController.checkLogin)
router.get('/get-me',verify, userController.getMe)
export default router;