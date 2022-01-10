import { pool } from "../controller/connectdatabase/Pool";
import { Product } from "../model/Product";

class ProductService {

    getListProductWithPagination = async (search: string, pageSize: number, pageIndex: number) => {
        let tempQuantity;
        let arrPageNumber = []
        let numberPage = 0
        let dataPage;
        if (search == "" || search == null) {
            tempQuantity = await pool.query(`select count("idProduct") from public.product`);
            const productsPage = await pool.query(` select * from public.product limit ${pageSize} offset ${(pageIndex - 1) * pageSize} ;`);
            dataPage = productsPage.rows
        }
        else {
            tempQuantity = await pool.query(`select count("idProduct") from public.product where "name" ilike '%${search}%'`);
            const productsPage = await pool.query(` select * from public.product   where "name" ilike '%${search}%' limit ${pageSize} offset ${(pageIndex - 1) * pageSize} ;`);
            dataPage = productsPage.rows
        }
        const quantityProduct: number = tempQuantity.rows[0].count
        quantityProduct % pageSize > 0 ? numberPage = Math.ceil(quantityProduct / pageSize) : numberPage = quantityProduct / pageSize
        for (let i = 0; i < numberPage; i++) {
            arrPageNumber.push(i)
        }
        return { dataPage, arrPageNumber }
    }

    AddProduct = async (product: Product) => {
        await pool.query(`INSERT INTO public.product  ("idProduct", "name", img, price) VALUES('${product.idProduct}', '${product.name}', '${product.img}', ${product.price});`);
    }
    DeleteProduct = async (id: string) => {
        await pool.query(`DELETE FROM public.product WHERE "idProduct"='${id}'`);
    }
    UpdateProduct = async (product: Product, id: string) => {
        await pool.query(`UPDATE public.product SET "name"='${product.name}' , img='${product.img}', price=${product.price} WHERE "idProduct"='${id}';`);
    }

    getProductDetail = async (idProduct: string) => {
        const product = await pool.query(`select *from public.product where "idProduct" ='${idProduct}'`);
        return product.rows[0]
    }
}

export const productService = new ProductService()

