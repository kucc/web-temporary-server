import db from './db';
import { parsePacket } from '../utils/parse-packet';

const UserModel = {
  getAllUser: async () => {
    const [users, index] = await db.promise().query('select * from Users');
    return parsePacket(users);
  },
};

export default UserModel;
