import { pool } from "../controller/connectdatabase/Pool";

class UserService {
    getInforUser = async (idUser: string) => {
        const inforUser = await pool.query(`SELECT * FROM public."user" where "idUser" = '${idUser}';`);
        return inforUser.rows
    }
}

export const userService = new UserService()