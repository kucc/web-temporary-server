import UserService from '../service/user-service';
import { Request, Response, NextFunction } from 'express';

const UserController = {
  getAllUser: async (req: Request, res: Response, next: NextFunction) => {
    console.log('here');
    const Users = await UserService.getAllUser();
    res.send(Users);
  },
};

export default UserController;
