import { userService } from "../services/UserService"
import express, { Request, Response, Router } from 'express'
class UserController {
    getInforUser = async (req: Request, res: Response) => {
        return res.json(await userService.getInforUser(req.params.idUser))
    }
}

export const userController = new UserController()