import { registerUser,loginUser } from "../controllers/Usercontroller";
const user = (app)=>{
      //register user
      app.route("/user/register").post(registerUser)
      // Login user
      app.route("/user/login").post(loginUser)
      return app;
}
export default AuthRoutes;