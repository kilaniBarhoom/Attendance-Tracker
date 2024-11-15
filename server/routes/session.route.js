import express from "express";
import { OK } from '../constants/status.constants.js';
import * as controller from '../controllers/session.controller.js';
import { auth, hasRole } from '../middleware/auth.middleware.js';
import catcher from '../middleware/catcher.middleware.js';
import Roles from "../utils/authRoles.js";

const router = express.Router()

router.use("/health", (req, res) => {
    return res.sendStatus(OK);
}
);

router.route("/")
    .all(auth, hasRole(Roles.ADMIN))
    .get(catcher(controller.getAllSessions))
router
    .delete("/:sessionId", auth, hasRole(Roles.ADMIN), catcher(controller.revokeSession))

export default router