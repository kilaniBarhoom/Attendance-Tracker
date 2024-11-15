import express from "express";
import { OK } from '../constants/status.constants.js';
import * as controller from '../controllers/auth.controller.js';
import catcher from '../middleware/catcher.middleware.js';

const router = express.Router()

router.use("/health", (req, res) => {
    return res.sendStatus(OK);
});

router.post('/login', catcher(controller.login))
router.delete('/logout', catcher(controller.logout))
router.post('/refreshToken', catcher(controller.refreshToken))




export default router