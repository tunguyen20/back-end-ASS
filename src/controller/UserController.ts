import { json } from 'stream/consumers';
import { userService } from "../services/UserService"
import express, { NextFunction, Request, Response, Router } from 'express'
const jwt = require('jsonwebtoken');
class UserController {
    getInforUser = async (req: Request, res: Response) => {
        return res.json(await userService.getInforUser(req.params.idUser))
    }
    checkLogin = async (req: Request, res: Response) => {
        let userResult = await userService.getIdUserLogin(req.body.userName, req.body.password)
        
        if (userResult != undefined) {
            let user = {
                id: userResult.idUser,
                roles:userResult.roles,
            }
            const token = jwt.sign(user, "passUser", { expiresIn: '30m' });
            res.header("token", token).send(token)
        } else {
            return res.json("false");
        }
    }
    getMe = async (req: Request, res: Response) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send("Vui lòng đăng nhập để được truy cập")
        try {
            let verifyToken = jwt.verify(token, "passUser")
            return res.json(await userService.getMe(verifyToken.id))
        } catch (error) {
            return res.status(403)

        }

    }

}

export const userController = new UserController()