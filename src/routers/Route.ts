import { Router } from "express";
import { cartController } from "../controller/CartController";
import { orderController } from "../controller/OrderController";
import { productController } from "../controller/ProductController";
import { userController } from "../controller/UserController";



const router = Router()

//products 
router.post('/products', productController.getListProductWithPagination)
router.post('/products/add', productController.addProduct)
router.delete('/products/delete/:id', productController.deleteProduct)
router.put('/products/edit/:id', productController.updateProduct)
router.get('/products/:id', productController.getProductDetail)

//cart
router.get('/cart/:idUser', cartController.getListCarts)
router.post('/add-cart/:idUser', cartController.addCart)
router.post('/save-plus-quantity-product-cart',cartController.savePlusQuantityProductCart)
router.post('/save-minus-quantity-product-cart',cartController.saveMinusQuantityProductCart)
router.post('/delete-product-cart',cartController.deleteProductCart)

router.post('/checkout',cartController.saveInforUserAndAddOrder)

router.get('/get-infor-user/:idUser',userController.getInforUser)
router.post('/historyorders/',orderController.getListOrder)

export default router;