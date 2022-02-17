

import { QueryResult } from "pg";
import { pool } from "../controller/connectdatabase/Pool";
import { Cart, Carts, orderBook } from '../model/Cart'
import { User } from "../model/User";
const { v4: uuidv4 } = require("uuid")
class CartService {
    getListCart = async (idUser: string) => {
        const resultCarts: QueryResult = await pool.query(`select b.state, o."idOrder" ,bl."imageBookCover" ,b."idBook",bl."bookTitle" ,b.price,ob.quantity ,ob."idOrderBook" from "order" o join "user" u  on o."idUser" =u."idUser" join order_book ob on ob."idOrder" = o."idOrder" 
        join book b on b."idBook" = ob."idBook"  join book_line bl on bl."idBookLine" = b."idBookLine" where u."idUser" ='${idUser}' and o."isTemporary" =false  ORDER BY b."idBook"  `);

        if (resultCarts.rows.length == 0) {
            const resultIdOrder: QueryResult = await pool.query(`select o."idOrder"  from "order" o join "user" u on u."idUser" =o."idUser" where o."isTemporary" =false  and u."idUser" ='${idUser}' `);
            // const idOrder = resultIdOrder.rows[0].idOrder
            if (resultIdOrder.rowCount == 0) {
                let idOrder = uuidv4()
                await pool.query(`INSERT INTO public."order"
                ("idOrder", "idUser", "orderStatus", "orderDate", "firstName", "lastName", phone, email, address, postcode, "isTemporary")
                VALUES('${idOrder}', '${idUser}', 'PENDING', '2002-04-02', '', '', '', '', '', '', false);
                `)
                const carts: Carts = {
                    idOrder: idOrder,
                    Cart: []
                }
                return (carts)
            }
            else {
                const carts: Carts = {
                    idOrder: resultIdOrder.rows[0].idOrder,
                    Cart: []
                }
                return (carts)
            }
        }
        else {
            const carts: Carts = {
                idOrder: "",
                Cart: [{
                    idBook: "",
                    imageBookCover: "",
                    bookTitle: "",
                    price: 0,
                    quantity: 0,
                    idOrderBook: "",
                    state: false
                }]
            }
            resultCarts.rows.map((item, index) => {
                carts.idOrder = item.idOrder
                if (carts.Cart[0].idBook == "") {
                    carts.Cart[0].idBook = item.idBook,
                        carts.Cart[0].bookTitle = item.bookTitle,
                        carts.Cart[0].imageBookCover = item.imageBookCover,
                        carts.Cart[0].price = item.price,
                        carts.Cart[0].quantity = item.quantity
                    carts.Cart[0].idOrderBook = item.idOrderBook
                    carts.Cart[0].state = item.state
                }
                else {
                    carts.Cart.push({
                        idBook: item.idBook,
                        bookTitle: item.bookTitle,
                        imageBookCover: item.imageBookCover,
                        price: item.price,
                        quantity: item.quantity,
                        idOrderBook: item.idOrderBook,
                        state: item.state
                    })
                }

            })

            return (carts)
        }


    }
    addCart = async (orderBook: orderBook) => {
        let idOrderBook = uuidv4()
        await pool.query(`DO $$ DECLARE
            BEGIN
            IF exists(select * from order_book ob  where ob."idBook"= '${orderBook.idBook}' and "idOrder"='${orderBook.idOrder}' ) then
           UPDATE public.order_book SET   quantity=quantity+${orderBook.quantity}, price=${orderBook.quantity} where "idBook"='${orderBook.idBook}' and "idOrder"='${orderBook.idOrder}';

            else INSERT INTO public.order_book
            ("idOrder", "idBook", quantity, price, "idOrderBook")
            VALUES('${orderBook.idOrder}', '${orderBook.idBook}',${orderBook.quantity}, ${orderBook.price}, '${idOrderBook}');
            END IF;
            END $$;`)

        return 1
    }

    savePlusQuantityBookCart = async (idOrderBook: string) => {
        await pool.query(`UPDATE public."order_book"  SET  quantity=quantity+1 where "idOrderBook" ='${idOrderBook}';`)
    }
    saveMinusQuantityBookCart = async (idOrderBook: string) => {
        await pool.query(`UPDATE public."order_book"  SET  quantity=quantity-1 where "idOrderBook" ='${idOrderBook}';`)
    }
    deleteBookCart = async (idOrderBook: string) => {
        await pool.query(`DELETE FROM public."order_book"
        WHERE "idOrderBook" ='${idOrderBook}'`)
    }
    savedOrder = async (userInfor: User, carts: Carts) => {
        let timeNow = new Date().toLocaleString();
        let queryUpdateOrderBook = ""
        carts.Cart.map((item) => {
            queryUpdateOrderBook += `UPDATE public.order_book  set  price=${item.price} where "idOrderBook"='${item.idOrderBook}';`
        })
        await pool.query(queryUpdateOrderBook)  

        await pool.query(`UPDATE public."order"
       SET  "orderDate"='${timeNow}', "firstName"='${userInfor.firstName}', "lastName"='${userInfor.lastName}', phone='${userInfor.phone}', email='${userInfor.email}', address='${userInfor.address}', postcode='${userInfor.postcode}', "isTemporary"=true
       WHERE "idOrder"='${carts.idOrder}';`)

    }
}

export const cartService = new CartService()