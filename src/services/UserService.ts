import { QueryResult } from 'pg';
import { pool } from "../controller/connectdatabase/Pool";

class UserService {
    getInforUser = async (idUser: string) => {
        const inforUser = await pool.query(`SELECT * FROM public."user" where "idUser" = '${idUser}';`);
        return inforUser.rows
    }
    getIdUserLogin = async (userName: string, passWord: string) => {
        const userResult: QueryResult = await pool.query(`SELECT "idUser", roles
        FROM public."user" where "userName"='${userName}' and  "password" ='${passWord}' ;`);
        if (userResult.rows.length > 0) {
            let idUser = userResult.rows[0].idUser
            let roles = userResult.rows[0].roles
            return { idUser, roles }
        }

    }
    getMe = async (idUser: string) => {
        const inferUser = await pool.query(`SELECT "idUser", "firstName", "lastName", phone, email, address, postcode, "userName"
        FROM public."user" where "idUser" = '${idUser}'`);
        return inferUser.rows[0]
    }
}

export const userService = new UserService()