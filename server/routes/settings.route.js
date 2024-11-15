//  settings route

import express from "express";
import { OK } from '../constants/status.constants.js';
import * as controller from '../controllers/settings.controller.js';
import { auth, hasRole } from '../middleware/auth.middleware.js';
import catcher from '../middleware/catcher.middleware.js';
import Roles from "../utils/authRoles.js";

const router = express.Router()

router.use("/health", (req, res) => {
    return res.sendStatus(OK);
});


router.route('/')
    .all(auth, hasRole(Roles.ADMIN, Roles.SUPERADMIN))
    .get(catcher(controller.getAllSettings))
    .patch(catcher(controller.editSettings))


export default router;