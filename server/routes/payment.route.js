import express from "express";
import { OK } from '../constants/status.constants.js';
import * as controller from '../controllers/payment.controller.js';
import { auth, hasRole } from '../middleware/auth.middleware.js';
import catcher from '../middleware/catcher.middleware.js';
import Roles from "../utils/authRoles.js";

const router = express.Router()

router.use("/health", (req, res) => {
    return res.sendStatus(OK);
});


router.route('/')
    .all(auth)
    .get(catcher(controller.getAllPayments))
    .post(hasRole(Roles.ADMIN, Roles.SUPERADMIN), catcher(controller.createPayment))

// router.get('/analytics', auth, hasRole(Roles.ADMIN, Roles.SUPERADMIN), catcher(controller.getAnalytics))
router.get('/:paymentId', auth, hasRole(Roles.ADMIN, Roles.SUPERADMIN, Roles.USER), catcher(controller.getSinglePayment))

router.route('/:paymentId')
    .all(auth, hasRole(Roles.ADMIN, Roles.SUPERADMIN))
    .delete(catcher(controller.deletePayment))
    .put(catcher(controller.editPayment))




export default router