import express from 'express';
import {signup, signin, logout} from '../controllers/auth.js'

const authRouter = express.Router();


authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/logout", logout);


export default authRouter;