import { productService } from "../services/ProductService"
import express, { Request, Response, Router } from 'express'
import { BookLine } from "../model/Product";
import { match } from "assert";
class ProductController {
    getListProductWithPagination = async (req: Request, res: Response) => {
        const search = req.body.search;
        const pageSize = req.body.pageSize
        const page = req.body.page
        
        console.log(search);
        console.log(pageSize);
        console.log(page);
        
        return res.json(await productService.getListProductWithPagination(search,page,pageSize))


    }
    getListBookSearchWithPagination = async (req: Request, res: Response) => {
      
        
        const search = req.body.search
        const pageSize =req.body.pageSize
        const page = req.body.page
        const idCategory=req.body.idCategory
        const sortBy=req.body.sortBy
        const minPrice=req.body.minPrice
        const maxPrice=req.body.maxPrice
       
        
        return res.json(await productService.getListProductSearchWithPagination(search,idCategory,sortBy,minPrice,maxPrice,page,pageSize))


    }
    getListCategory=async(req:Request,res:Response)=>{
        return res.json(await productService.getListCategory())
    }
    getPublisher=async(req:Request,res:Response)=>{
        return res.json(await productService.getListPublisher())
    }
    addBook = async (req: Request, res: Response) => {
        let BookLineBook: BookLine = req.body.bookLine
      
        return res.json(await productService.AddProduct(BookLineBook))
    }
    deleteBook = async (req: Request, res: Response) => {
        console.log(req.params.id   );
        
        return res.json(await productService.DeleteBook(req.params.id))
    }
    
    getProductDetail = async (req: Request, res: Response) => {

        let idProduct = req.params.id
        return res.json(await productService.getBookDetail(idProduct))
    }

}
export const productController = new ProductController