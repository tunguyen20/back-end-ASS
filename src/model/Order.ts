 interface Cart {
    idProduct: number
    price: number
    name: string
    img: string
    quantity:number
}


export interface OrderProduct {
    products: Cart
    firstName: string
    lastName: string
    address: string
    mobile:string
    email:string
    postcode:string
    time: number

}