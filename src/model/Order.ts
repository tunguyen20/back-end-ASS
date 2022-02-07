
import { orderBook } from "./Cart";
import { Product } from "./Product";
import { User } from "./User";

// interface Cart {
//     idProduct: number
//     price: number
//     name: string
//     img: string
//     quantity: number
// }
export interface Order {
    idOrder: string
    idUser: string
    orderStatus: string
    orderDate: string
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    postcode: string
    isTemporary: boolean
}

export interface orderBookProps {
    idBook: string
    price: number
    quantity: number
    idOrder: string
    bookTitle: string
    state: boolean
    imageBookCover: string
}
export interface OrderWithDetail extends Order {
    orderBooks: orderBookProps[]


}
// export interface OrderProduct {
//     id: string
//     idOrder: string
//     idProduct: string
//     quantity: number
//     price: number
//     product: Product
// }