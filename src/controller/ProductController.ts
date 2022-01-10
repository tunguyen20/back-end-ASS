import { productService } from "../services/ProductService"
import express, { Request, Response, Router } from 'express'
import { Product } from "../model/Product";
class ProductController {
    getListProductWithPagination = async (req: Request, res: Response) => {
        const search = req.body.search;
        const pageSize = req.body.pageSize
        const page = req.body.page
        return res.json(await productService.getListProductWithPagination(search, pageSize, page))
    }
    addProduct = async (req: Request, res: Response) => {
        let product: Product = req.body.product;
        return res.json(await productService.AddProduct(product))
    }
    deleteProduct = async (req: Request, res: Response) => {
        return res.json(await productService.DeleteProduct(req.params.id))
    }
    updateProduct = async (req: Request, res: Response) => {
        let product: Product = req.body;
        let idProduct = req.params.id
        await productService.UpdateProduct(product, idProduct)
    }
    getProductDetail = async (req: Request, res: Response) => {
   
        let idProduct = req.params.id
        return res.json( await productService.getProductDetail(idProduct))
    }

}
export const productController = new ProductController