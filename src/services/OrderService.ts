import { pool } from '../controller/connectdatabase/Pool';
import { QueryResult } from "pg";
import { OrderWithDetail } from '../model/Order';

class OrderService {
    getListOrderByUser = async (pageSize: number, page: number, idUser: string) => {
        const resultOrderCount: QueryResult = await pool.query(`SELECT "idOrder" 
                                    FROM
                                   "order" o where o."isTemporary" = true and "idUser" ='${idUser}'
                                 `
        );
        const bookCount: number = resultOrderCount.rowCount

        const historyOrder: QueryResult = await pool.query(`select o."idOrder",o."orderStatus" ,o."idUser" ,o."isTemporary" , o."orderDate" ,b."idBook"  , o."firstName" ,o."lastName" ,o.phone ,o.email ,o.address ,o.postcode ,ob.quantity ,ob.price  ,
        bl."imageBookCover" ,bl."bookTitle", b.state 
                from "order" o join order_book ob on o."idOrder" =ob."idOrder" join book b on b."idBook" =ob."idBook" 
                join book_line bl  on bl."idBookLine" = b."idBookLine" where 
                o."idOrder" in(SELECT "idOrder" 
                                    FROM
                                   "order" o where o."isTemporary" = true and "idUser" ='${idUser}'
                                   limit ${pageSize} offset (${pageSize * (page - 1)}))`
        );
        const listOrder: OrderWithDetail[] = []
        historyOrder.rows.map(item => {
            let order: OrderWithDetail = {
                address: '',
                email: "",
                firstName: "",
                idOrder: "",
                idUser: "",
                isTemporary: true,
                lastName: "",
                orderDate: "",
                orderStatus: "",
                phone: "",
                postcode: '',
                orderBooks: []
            }
            if (listOrder.length == 0) {
                order.address = item.address
                order.email = item.email
                order.firstName = item.firstName
                order.idOrder = item.idOrder
                order.idUser = item.idUser
                order.isTemporary = item.isTemporary
                order.lastName = item.lastName
                order.orderDate = item.orderDate
                order.orderStatus = item.orderStatus
                order.phone = item.phone
                order.postcode = item.postcode

                order.orderBooks.push({
                    idBook: item.idBook,
                    idOrder: item.idOrder,
                    price: item.price,
                    imageBookCover: item.imageBookCover,
                    bookTitle: item.bookTitle,
                    state: item.state,
                    quantity: item.quantity
                })
                listOrder.push(order)
            }
            else {
                let check = -1
                listOrder.map((item2, index2) => {
                    if (item2.idOrder == item.idOrder) {
                        check = 1
                        listOrder[index2].orderBooks.push({
                            idBook: item.idBook,
                            idOrder: item.idOrder,
                            price: item.price,
                            state: item.state,
                            bookTitle: item.bookTitle,
                            imageBookCover: item.imageBookCover,
                            quantity: item.quantity
                        })
                    }

                })
                if (check == -1) {
                    order.address = item.address
                    order.email = item.email
                    order.firstName = item.firstName
                    order.idOrder = item.idOrder
                    order.idUser = item.idUser
                    order.isTemporary = item.isTemporary
                    order.lastName = item.lastName
                    order.orderDate = item.orderDate
                    order.orderStatus = item.orderStatus
                    order.phone = item.phone

                    order.postcode = item.postcode
                    order.orderBooks.push({
                        idBook: item.idBook,
                        idOrder: item.idOrder,
                        price: item.price,
                        state: item.state,
                        bookTitle: item.bookTitle,
                        imageBookCover: item.imageBookCover,
                        quantity: item.quantity
                    })
                    listOrder.push(order)
                }
            }

        })

        return { listOrder, bookCount }

    }
    getListOrder = async (pageSize: number, page: number, sortBy: string,filter:string,idOrder:string) => {
        let queryFilter=""
        if(filter!=undefined){
              if(filter.toUpperCase()!="ALL" ){
            queryFilter=`and o."orderStatus"='${filter}'`
        }
        }
        const resultOrderCount: QueryResult = await pool.query(`SELECT "idOrder" 
                                    FROM
                                   "order" o where o."isTemporary" = true ${queryFilter}
                                 `
        );
        const bookCount: number = resultOrderCount.rowCount
        
      
        const historyOrder: QueryResult = await pool.query(`select o."idOrder",o."orderStatus" , o."orderDate" ,b."idBook"  , o."firstName" ,o."lastName" ,o.phone ,o.email ,o.address ,o.postcode ,ob.quantity ,ob.price  ,
        bl."imageBookCover" ,bl."bookTitle", b.state 
                from "order" o join order_book ob on o."idOrder" =ob."idOrder" join book b on b."idBook" =ob."idBook" 
                join book_line bl  on bl."idBookLine" = b."idBookLine" where 
                o."idOrder" in(SELECT "idOrder" 
                                    FROM
                                   "order" o where o."isTemporary" = true  ${queryFilter}  and o."idOrder" ilike '%${idOrder}%' 
                                   limit ${pageSize} offset (${pageSize * (page - 1)})) ${sortBy}` 
        );
        const listOrder: OrderWithDetail[] = []
        historyOrder.rows.map(item => {
            let order: OrderWithDetail = {
                address: '',
                email: "",
                firstName: "",
                idOrder: "",
                idUser: "",
                isTemporary: true,
                lastName: "",
                orderDate: "",
                orderStatus: "",
                phone: "",
                postcode: '',
                orderBooks: []
            }
            if (listOrder.length == 0) {
                order.address = item.address
                order.email = item.email
                order.firstName = item.firstName
                order.idOrder = item.idOrder
                order.idUser = item.idUser
                order.isTemporary = item.isTemporary
                order.lastName = item.lastName
                order.orderDate = item.orderDate
                order.orderStatus = item.orderStatus
                order.phone = item.phone
                order.postcode = item.postcode

                order.orderBooks.push({
                    idBook: item.idBook,
                    idOrder: item.idOrder,
                    price: item.price,
                    imageBookCover: item.imageBookCover,
                    bookTitle: item.bookTitle,
                    state: item.state,
                    quantity: item.quantity
                })
                listOrder.push(order)
            }
            else {
                let check = -1
                listOrder.map((item2, index2) => {
                    if (item2.idOrder == item.idOrder) {
                        check = 1
                        listOrder[index2].orderBooks.push({
                            idBook: item.idBook,
                            idOrder: item.idOrder,
                            price: item.price,
                            state: item.state,
                            bookTitle: item.bookTitle,
                            imageBookCover: item.imageBookCover,
                            quantity: item.quantity
                        })
                    }

                })
                if (check == -1) {
                    order.address = item.address
                    order.email = item.email
                    order.firstName = item.firstName
                    order.idOrder = item.idOrder
                    order.idUser = item.idUser
                    order.isTemporary = item.isTemporary
                    order.lastName = item.lastName
                    order.orderDate = item.orderDate
                    order.orderStatus = item.orderStatus
                    order.phone = item.phone

                    order.postcode = item.postcode
                    order.orderBooks.push({
                        idBook: item.idBook,
                        idOrder: item.idOrder,
                        price: item.price,
                        state: item.state,
                        bookTitle: item.bookTitle,
                        imageBookCover: item.imageBookCover,
                        quantity: item.quantity
                    })
                    listOrder.push(order)
                }
            }

        })


        return { listOrder, bookCount }

    }
    setStatusOrder= async(nameStatus:string,idOrder:string)=>{
        await pool.query(`UPDATE public."order"
        SET  "orderStatus"='${nameStatus}'
        WHERE "idOrder"='${idOrder}';`);
    }
}
export const orderService = new OrderService()