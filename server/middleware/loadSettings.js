import Settings from "../models/settings.js";

const loadSettings = async (req, res, next) => {
    const settings = await Settings.findOne();
    req.appSettings = settings; // Attach to request for use in controller
    next();
}

export default loadSettings;