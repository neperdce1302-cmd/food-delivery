import  express from "express"
import autheMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder , userOrders, listOrders, updateStatus} from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",autheMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",autheMiddleware,userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post("/status",updateStatus);

export default orderRouter