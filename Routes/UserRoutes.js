import {getusers, getuser, updateuser, deleteuser, } from './controllers/UserController.js'
import {login, register} from'../controllers/Authcontroller.js'

//get users
const Userroutes =(app) =>{
      app.route('/users')
      console.log(users)
      .get(getusers)
      //get user by id
      app.route('/user/:id')
      .put(updateuser)
      .get(getuser)
      .delete(deleteuser);
}
export default Userroutes;