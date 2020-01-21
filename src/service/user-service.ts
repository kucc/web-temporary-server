import UserModel from '../model/user-model';

const UserService = {
  getAllUser: async () => {
    return await UserModel.getAllUser();
  },
};

export default UserService;
