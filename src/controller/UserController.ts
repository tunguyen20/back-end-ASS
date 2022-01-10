import { json } from 'stream/consumers';
import { userService } from "../services/UserService"
import express, { NextFunction, Request, Response, Router } from 'express'
const jwt = require('jsonwebtoken');
class UserController {
    getInforUser = async (req: Request, res: Response) => {
        return res.json(await userService.getInforUser(req.params.idUser))
    }
    checkLogin = async (req: Request, res: Response) => {

        let idUser = await userService.getIdUserLogin(req.body.userName, req.body.password)
        console.log(idUser);
        
        if (idUser != undefined) {
            let user = {
                id: idUser.idUser
            }
            const token = jwt.sign(user, "passUser", { expiresIn: '20s' });
            res.header("token", token).send(token)

        } else {
            return res.json("false");

        }
    }
    getMe = async (req: Request, res: Response) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send("Vui lòng đăng nhập để được truy cập")
        try {
           let a= jwt.verify(token, "passUser")
            // req.user = checkToken;
              return res.json(await userService.getMe(a.id))
        } catch (error) {
        // res.redirect('/login')e
          
        }
    
         

 


    }

}

export const userController = new UserController()