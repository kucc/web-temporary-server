import { Router } from 'express';

import UserController from '../controller/user-controller';
import { doAsync } from '../utils/do-async';

const UserRouter = Router();
UserRouter.get('/', doAsync(UserController.getAllUser));

export default UserRouter;
