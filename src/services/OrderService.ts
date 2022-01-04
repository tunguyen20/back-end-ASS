import { pool } from '../controller/connectdatabase/Pool';
import { QueryResult } from "pg";
import { OrderWithDetail } from '../model/Order';

class OrderService {
    getListOrder = async (pageSize:number,pageIndex:number,idUser:string) => {
        let resultNumberPageWithOrder: QueryResult = await pool.query(`select o."idOrder" 
        FROM
        "order" o join "user" u on o."idUser" = u."idUser"  where o."orderStatus" =true and u."idUser" ='1' 
        group by o."idOrder"`
        );

        const quantityOrderWithIdUser: number = resultNumberPageWithOrder.rowCount
        let numberPageOrder: number = 0
        quantityOrderWithIdUser % pageSize > 0 ? numberPageOrder = Math.ceil(quantityOrderWithIdUser / pageSize) : numberPageOrder = quantityOrderWithIdUser / pageSize
        let arrNumberPageOrder = []
        for (let i = 0; i < numberPageOrder; i++) {
            arrNumberPageOrder.push(i)

        }
        let historyOrder: QueryResult = await pool.query(`SELECT * FROM public."order_product" op join "order" o on o."idOrder" = op."idOrder" join "user" u on u."idUser" = o."idUser"
        join product p on p."idProduct" = op."idProduct" where  o."idOrder" in 
        (SELECT o2."idOrder" 
                    FROM
                    "order" o2 join "user" u2 on o2."idUser" = u2."idUser"  where o2."orderStatus" =true and u2."idUser" ='${idUser}' 
                    group by o2."idOrder"  limit ${pageSize} offset (${(pageIndex - 1) * pageSize})
                    
            );`
        );
        const listOrderRows = historyOrder.rows
        let arrListIdOrder: [][] = []
        let temp = []
        for (let i = 0; i < historyOrder.rows.length; i++) {
            temp.push(historyOrder.rows[i].idOrder)
        }
        arrListIdOrder = Array.from(new Set(temp))
        const listOrder: OrderWithDetail[] = []
        arrListIdOrder.map(item => {
            const order: OrderWithDetail = {
                idOrder: "",
                idUser: "1",
                orderStatus: false,
                orderDate: "",
                orderProducts: [],
                user: {
                    address: "", email: "", firstName: "", idUser: "", lastName: "", phone: "", postcode: "",
                }
            }
            listOrderRows.map(item1 => {
                if (item1.idOrder == item) {
                    order.idOrder = item1.idOrder,
                        order.idUser = item1.idUser,
                        order.orderStatus = true,
                        order.orderDate = item1.orderDate,

                        order.orderProducts.push({
                            id: item1.idOrderProduct,
                            idOrder: item1.idOder,
                            idProduct: item1.idProduct,
                            price: item1.price,
                            quantity: item1.quantity,
                            product: {
                                idProduct: item1.idProduct,
                                name: item1.name,
                                img: item1.img,
                                price: item1.price
                            }
                        }),
                        order.user = {
                            firstName: item1.firstName,
                            lastName: item1.lastName,
                            address: item1.address,
                            idUser: item1.idUser,
                            phone: item1.phone,
                            postcode: item1.postcode,
                            email: item1.email
                        }
                }
            })

            listOrder.push(order)
        })

        return {listOrder, arrNumberPageOrder }
    }
}
export const orderService = new OrderService()