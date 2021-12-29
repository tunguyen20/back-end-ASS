import express, { Request, Response } from 'express'
import { ListProps } from './model/ListProps'
import { OrderProduct } from './model/Order'
import { products, Product } from './model/Product'
var cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


let data: Product[] = products
app.delete('/products/delete/:id', (req: Request, res: Response) => {
    let id = Number(req.params.id)
    let productsAfterDelete = data.filter(products => products.idProduct != id)
    data = productsAfterDelete
    return res.json({ productsAfterDelete })
})

app.get('/products/:id', (req: Request, res: Response) => {
    let productDetail
    data.map((item, index) => (item.idProduct == Number(req.params.id)) ? productDetail = data[index] : "")
    return res.json({ productDetail })
})
app.post('/products', (req: Request, res: Response) => {
    const listProps: ListProps = req.body
    const { page, pageSize, search } = listProps

    if (search != null) {
        let products = data.filter((data => data.name.toUpperCase().includes(req.body.search.toUpperCase())))
        return res.json(pagination(page, pageSize, products))
    }
    else {
        return res.json(pagination(page, pageSize, data))
    }


})

let orders: OrderProduct[] = [{
    products: { idProduct: 0, name: "", price: 0, img: "", quantity: 0 }, firstName: "", lastName: "", address: "", email: "", mobile: "", postcode: "", time: 0,
}]
orders = []

app.get('/orders', (req: Request, res: Response) => {
    return res.json({ orders })

})
app.post('/order', (req: Request, res: Response) => {
    let dataOrder: OrderProduct
    dataOrder = req.body.orderProduct
    if (dataOrder != null) {
        orders.push(dataOrder)
    }
})
function pagination(pageIndex: number, perPage: number, data: Product[],) {
    let page: number = pageIndex// id page dc goi
    let numberPage: number // so page 
    let prePage = perPage //so san pham moi trang
    let arrPagenumber = [] // mang luu so page
    data.length % prePage > 0 ? numberPage = Math.ceil(data.length / prePage) : numberPage = data.length / prePage
    for (let i = 0; i < numberPage; i++) { arrPagenumber.push(i) }
    let dataPage = data.slice((page - 1) * prePage, page * prePage)
    return { dataPage, arrPagenumber }
}
app.post('/products/add', (req: Request, res: Response) => {
    data.push(req.body.product)
    return res.json({ data })
})


app.put('/products/edit/:id', (req: Request, res: Response) => {
    data.map((item, index) => (item.idProduct == Number(req.params.id) ? data[index] = { ...req.body } : ""))
    return res.json({ data })

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