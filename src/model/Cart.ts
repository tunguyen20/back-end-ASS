export interface orderBook {
    idBook: string
    price: number
    quantity: number
    idOrder: string
}
export interface Cart {
    idBook: string
    price: number
    quantity: number
    imageBookCover: string
    bookTitle: string
    idOrderBook: string
    state: boolean
}
export interface Carts {
    idOrder: string
    Cart: Cart[]
}
// export interface OrderWithDetail extends Order {
//     orderProducts: OrderProduct[]
//     user: User
// }