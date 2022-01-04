import { orderProduct } from "./Cart";
import { Product } from "./Product";
import { User } from "./User";

interface Cart {
    idProduct: number
    price: number
    name: string
    img: string
    quantity: number
}
export interface Order {
    idOrder: string
    idUser: string
    orderStatus: boolean
    orderDate: string
}
export interface OrderWithDetail extends Order {
    orderProducts: OrderProduct[]
    user: User
}
// export const order: OrderWithDetail = {
//     idOrder: "",
//     idUser: "1",
//     orderStatus: false,
//     orderDate: "",
//     orderProducts: [{
//         id: "",
//         idOrder: "",
//         idProduct: "",
//         price: 334,
//         quantity: 2,
//         product: {
//             idProduct: "",
//             img: "",
//             name: "",
//             price: 211221
//         }
//     }

//     ],
//     user: {
//         address: "",
//         email: "",
//         firstName: "",
//         idUser: "",
//         lastName: "",
//         phone: "",
//         postcode: "",
//     }
// }
// export interface OrderProducts {
//     products: Cart
//     firstName: string
//     lastName: string
//     address: string
//     mobile: string
//     email: string
//     postcode: string
//     time: number

// }
export interface OrderProduct {
    id: string
    idOrder: string
    idProduct: string
    quantity: number
    price: number
    product: Product
}