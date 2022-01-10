import { pool } from "../controller/connectdatabase/Pool";

class UserService {
    getInforUser = async (idUser: string) => {
        const inforUser = await pool.query(`SELECT * FROM public."user" where "idUser" = '${idUser}';`);
        return inforUser.rows
    }
    getIdUserLogin = async (userName: string, passWord: string) => {
        const idUser = await pool.query(`SELECT "idUser"
        FROM public."user" where "userName"='${userName}' and  "password" ='${passWord}' ;`);
        return idUser.rows[0]
    }
    getMe= async(idUser:string)=>{
        const inferUser = await pool.query(`SELECT "idUser", "firstName", "lastName", phone, email, address, postcode, "userName"
        FROM public."user" where "idUser" = '${idUser}'`);
        return inferUser.rows[0]
    }
}

export const userService = new UserService()