import express from "express";
import { 
    register, 
    login, 
    logout, 
    getOtherUsers,
    searchUsers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnectionRequests
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated, getOtherUsers);
router.route("/search").get(isAuthenticated, searchUsers);
router.route("/requests").get(isAuthenticated, getConnectionRequests);
router.route("/request/send/:id").post(isAuthenticated, sendConnectionRequest);
router.route("/request/accept/:id").post(isAuthenticated, acceptConnectionRequest);
router.route("/request/reject/:id").post(isAuthenticated, rejectConnectionRequest);

export default router;
