import { pool } from "../controller/connectdatabase/Pool";
import { orderProduct } from '../model/Cart'
import { User } from "../model/User";
const { v4: uuidv4 } = require("uuid")
class CartService {
    getListCart = async (idUser: string) => {
        const carts = await pool.query(`select "idOrderProduct", o."idOrder", p."idProduct" ,p."name",p.img,op.quantity ,p.price FROM public."order_product" op join "order" o on o."idOrder" = op."idOrder" 
        join product p on p."idProduct" = op."idProduct" where o."orderStatus" =false and o."idUser" ='${idUser}';`);
        return (carts.rows)
    }
    addCart = async (orderProduct: orderProduct, idUser: string) => {
        const fullDataIdOrder = await pool.query(`select  "idOrder" from "order" o join "user" u on o."idUser"=u."idUser" 
       where o."orderStatus" =false and u."idUser" ='${idUser}'`);
        let idOder: any = fullDataIdOrder.rows
        if (idOder[0] != null) {
            let idOrderProduct = uuidv4()
            let idOrder = idOder[0]
            await pool.query(`DO $$ DECLARE
            BEGIN
            IF exists(select * from "order_product" op where op."idProduct" = '${orderProduct.idProduct}' and "idOrder"='${idOrder.idOrder}' ) then
            UPDATE public."order_product"
            SET    quantity=quantity +${orderProduct.quantity} where "idProduct" = '${orderProduct.idProduct}' and "idOrder" ='${idOrder.idOrder}';
            else INSERT INTO public."order_product" ("idOrder", "idProduct", quantity, price, "idOrderProduct")
            VALUES('${idOrder.idOrder}', '${orderProduct.idProduct}', ${orderProduct.quantity}, ${orderProduct.price},'${idOrderProduct}');
            END IF;
            END $$;`)

        } else {
            let idOrder = uuidv4()
            let idOrderProduct = uuidv4()
            await pool.query(`	INSERT INTO public."order" ("idOrder", "idUser", "orderStatus", "orderDate")
             VALUES('${idOrder}', '${idUser}', false, '10:10 10-10-2021');`)

            await pool.query(`INSERT INTO public."order_product" ("idOrder", "idProduct", quantity, price, "idOrderProduct")
            VALUES('${idOrder}', '${orderProduct.idProduct}', ${orderProduct.quantity}, ${orderProduct.price},'${idOrderProduct}');`)
        }
        return 1
    }

    savePlusQuantityProductCart = async (idOrderProduct: string) => {
        await pool.query(`UPDATE public."order_product"  SET  quantity=quantity+1 where "idOrderProduct" ='${idOrderProduct}';`)

    }
    saveMinusQuantityProductCart = async (idOrderProduct: string) => {
        await pool.query(`UPDATE public."order_product"  SET  quantity=quantity-1 where "idOrderProduct" ='${idOrderProduct}';`)
    }
    deleteProductCart = async (idOrderProduct: string) => {
        await pool.query(`DELETE FROM public."order_product"
        WHERE "idOrderProduct" ='${idOrderProduct}'`)
    }
    saveInforUserAndAddOrder = async (inforUser: User,idOrder:string) => {
        let timeNow = new Date();
        
        //update user
        await pool.query(`UPDATE public."user"
        SET "firstName"='${inforUser.firstName}', "lastName"='${inforUser.lastName}', phone='${inforUser.phone}', email='${inforUser.email}', address='${inforUser.address}', postcode='${inforUser.postcode}'
        WHERE "idUser"='${inforUser.idUser}';`)
        //add order
        await pool.query(`UPDATE public."order"  SET  "orderStatus"=true , "orderDate"='${timeNow}' WHERE "idOrder"='${idOrder}';`)
    }
}

export const cartService = new CartService()