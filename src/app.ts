import express, { Request, Response } from 'express'
import { connect } from 'http2'
import { orderProduct } from './model/Cart'
import { ListProps } from './model/ListProps'
import { OrderProduct } from './model/Order'
import { products, Product } from './model/Product'
import { user } from './model/User'
const { Pool, Client } = require("pg")
const { v4: uuidv4 } = require("uuid")
var cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


const credentials = {
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "tunguyen20",
    database: "[dbFirst]"
};
async function getListProducts() {
    const client = new Client(credentials);
    await client.connect();
    const products = await client.query("select * from public.product");
    await client.end();
    return products.rows;
}
async function AddProduct(product: Product) {
    const client = new Client(credentials);
    await client.connect();

    await client.query(`INSERT INTO public.product  ("idProduct", "name", img, price) VALUES('${product.idProduct}', '${product.name}', '${product.img}', ${product.price});`);
    await client.end();

}
async function getDetailProduct(id: string) {
    const client = new Client(credentials);
    await client.connect();
    const product = await client.query(`select *from public.product where "idProduct" ='${id}'`);
    await client.end();
    return product.rows
}
async function DeleteProduct(id: string) {
    const client = new Client(credentials);
    await client.connect();
    await client.query(`DELETE FROM public.product WHERE "idProduct"='${id}'`);
    await client.end();

}
async function EditProduct(product: Product, id: string) {
    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public.product SET "name"='${product.name}' , img='${product.img}', price=${product.price} WHERE "idProduct"='${id}';`);
    await client.end();
}
async function getPaginationProduct(search: string, pageIndex: number, pageSize: number) {
    const client = new Client(credentials);
    await client.connect();
    let tempQuantity;
    let arrPagenumber = []
    let numberPage = 0
    let dataPage;
    if (search == "") {
        tempQuantity = await client.query(`select count("idProduct") from public.product`);
        const productsPage = await client.query(` select * from public.product limit ${pageSize} offset ${(pageIndex - 1) * pageSize} ;`);
        dataPage = productsPage.rows
    }
    else {
        tempQuantity = await client.query(`select count("idProduct") from public.product where "name" ilike '%${search}%'`);
        const productsPage = await client.query(` select * from public.product   where "name" ilike '%${search}%' limit ${pageSize} offset ${(pageIndex - 1) * pageSize} ;`);
        dataPage = productsPage.rows
    }

    const quantityProduct: number = tempQuantity.rows[0].count
    quantityProduct % pageSize > 0 ? numberPage = Math.ceil(quantityProduct / pageSize) : numberPage = quantityProduct / pageSize
    for (let i = 0; i < numberPage; i++) {
        arrPagenumber.push(i)
    }

    return { dataPage, arrPagenumber }
}

async function getIdOrderProduct(idUser: string) {
    const client = new Client(credentials);
    await client.connect();
    const fullDataId = await client.query(`select  "idOrder" from "order" o join "user" u on o."idUser"=u."idUser" 
   where o."orderStatus" =false and u."idUser" ='${idUser}'`);
    let idOder: any = fullDataId.rows
    await client.end();
    return idOder[0]

}
app.post('/addcart/:idUser', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    const orderProduct: orderProduct = req.body.orderProduct

    if (await getIdOrderProduct(req.params.idUser) != null) {
        let idOrderProduct = uuidv4()
        let idOrder = await getIdOrderProduct(req.params.idUser)

        await client.query(`DO $$ DECLARE
        BEGIN
        IF exists(select * from "orderProduct" op where op."idProduct" = '${orderProduct.idProduct}' and "idOrder"='${idOrder.idOrder}' ) then

        UPDATE public."orderProduct"
        SET    quantity=quantity +${orderProduct.quantity} where "idProduct" = '${orderProduct.idProduct}' and "idOrder" ='${idOrder.idOrder}';

        else INSERT INTO public."orderProduct" ("idOrder", "idProduct", quantity, price, "idOrderProduct")
        VALUES('${idOrder.idOrder}', '${orderProduct.idProduct}', ${orderProduct.quantity}, ${orderProduct.price},'${idOrderProduct}');
        END IF;
        END $$;`)

    } else {
        let idOrder = uuidv4()
        let idOrderProduct = uuidv4()
        await client.query(`	INSERT INTO public."order" ("idOrder", "idUser", "orderStatus", "orderDate")
         VALUES('${idOrder}', '${req.params.idUser}', false, '10:10 10-10-2021');`)

        await client.query(`INSERT INTO public."orderProduct" ("idOrder", "idProduct", quantity, price, "idOrderProduct")
        VALUES('${idOrder}', '${orderProduct.idProduct}', ${orderProduct.quantity}, ${orderProduct.price},'${idOrderProduct}');`)
    }
    await client.end();

    return res.json(req.body)
})
app.post('/savePlusQuantityCart', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public."orderProduct"
    SET  quantity=quantity+1 where "idOrderProduct" ='${req.body.idOrderProduct}';`)
    await client.end();
    return res.json(req.body)
})
app.post('/saveMinusQuantityCart', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    await client.query(`UPDATE public."orderProduct"
    SET  quantity=quantity-1 where "idOrderProduct" ='${req.body.idOrderProduct}';`)
    await client.end();
    return res.json(req.body)
})
app.post('/deleteProductCart', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    await client.query(`DELETE FROM public."orderProduct"
    WHERE "idOrderProduct" ='${req.body.idOrderProduct}'`)
    await client.end();
    return res.json(req.body)
})
app.post('/checkout', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    const inforUser: user = req.body.inforUser
    let tiemNow = new Date();

    await client.query(`UPDATE public."user"
    SET "firstName"='${inforUser.firstName}', "lastName"='${inforUser.lastName}', phone='${inforUser.phone}', email='${inforUser.email}', address='${inforUser.address}', postcode='${inforUser.postcode}'
    WHERE "idUser"='${inforUser.idUser}';`)

    await client.query(`UPDATE public."order"  SET  "orderStatus"=true , "orderDate"='${tiemNow}' WHERE "idOrder"='${req.body.idOrder}';`)
    await client.end();
    return res.json(inforUser)
})
app.get('/getInforUser/:idUser', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    const inforUser = await client.query(`SELECT * FROM public."user" where "idUser" = '${req.params.idUser}';`);
    await client.end();
    return res.json(inforUser.rows)
})
app.delete('/products/delete/:id', async (req: Request, res: Response) => {
    DeleteProduct(req.params.id)
})
app.get('/cart/:id', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    const carts = await client.query(`select "idOrderProduct", o."idOrder", p."idProduct" ,p."name",p.img,op.quantity ,p.price FROM public."orderProduct" op join "order" o on o."idOrder" = op."idOrder" 
    join product p on p."idProduct" = op."idProduct" where o."orderStatus" =false and o."idUser" ='${req.params.id}';`);
    await client.end();
    return res.json(carts.rows)
})
app.get('/products/:id', async (req: Request, res: Response) => {
    const productDetails: Product[] = await getDetailProduct(req.params.id)
    const productDetail = productDetails[0]
    return res.json({ productDetail })
})
app.post('/products', async (req: Request, res: Response) => {

    const listProps: ListProps = req.body
    const { page, pageSize, search } = listProps
    //commet
    if (search != null && search != "") {
        return res.json(await getPaginationProduct(search, page, pageSize))
    }
    else {
        return res.json(await getPaginationProduct("", page, pageSize))
    }

})


app.get('/historyorders/:idUser', async (req: Request, res: Response) => {
    const client = new Client(credentials);
    await client.connect();
    const historyOrder = await client.query(`select o."orderDate" ,u."lastName" ,u."firstName" ,u.email ,u.address ,u.phone ,u.postcode ,p."name",p.img,op.quantity ,p.price FROM public."orderProduct" op join "order" o on o."idOrder" = op."idOrder" 
    join product p on p."idProduct" = op."idProduct" join "user" u on u."idUser" = o."idUser"  where o."orderStatus" =true and o."idUser" ='${req.params.idUser}';
`);
    await client.end();
    return res.json(historyOrder.rows)


})
// app.post('/order', (req: Request, res: Response) => {
//     let dataOrder: OrderProduct
//     dataOrder = req.body.orderProduct
//     if (dataOrder != null) {
//         orders.push(dataOrder)
//     }
// })
function pagination(pageIndex: number, perPage: number, data: Product[]) {
    let page: number = pageIndex// id page dc goi
    let numberPage: number // so page 
    let prePage = perPage //so san pham moi trang
    let arrPagenumber = [] // mang luu so page
    data.length % prePage > 0 ? numberPage = Math.ceil(data.length / prePage) : numberPage = data.length / prePage
    for (let i = 0; i < numberPage; i++) { arrPagenumber.push(i) }
    let dataPage = data.slice((page - 1) * prePage, page * prePage)
    return { dataPage, arrPagenumber }
}
app.post('/products/add', async (req: Request, res: Response) => {
    let product: Product = req.body.product;
    AddProduct(product)
    let data: Product[] = await getListProducts();

})


app.put('/products/edit/:id', (req: Request, res: Response) => {
    EditProduct(req.body, req.params.id)

})
// app.get('/products/search/name/:name', (req: Request, res: Response) => {
//     let dataSearch = data.filter((data => data.name.toUpperCase().includes(req.params.name.toUpperCase())))

//     if (req.params.name == "null") {
//         dataSearch = data
//     }
//     return res.json({ dataSearch })
// })


// app.get('/products/page/:idpage', (req: Request, res: Response) => {
//     let dataPage: Product[] = []
//     let page = Number(req.params.idpage) // id page dc goi
//     let numberPage: number // so page 
//     let prePage = 4 //so san pham moi trang
//     let arrPagenumber = [] // mang luu so page
//     data.length % prePage > 0 ? numberPage = Math.ceil(data.length / prePage) : numberPage = data.length / prePage
//     for (let i = 0; i < numberPage; i++) { arrPagenumber.push(i) }
//     dataPage = data.slice((page - 1) * prePage, page * prePage)
//     return res.json({ dataPage, arrPagenumber })
// })

















// app.post('/api/data', (req, res) => {
//     console.log(req);

//     return res.sendStatus(200)
// })

// app.route('/').get((req: Request, res: Response) => { return res.send('method get') })


app.listen(3001, () => {
    console.log("Port: 3001");
})