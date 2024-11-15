import ms from 'ms';
import Session from '../models/Session.js';

const sendToken = async (user, statusCode, res) => {
    const refreshToken = user.genRefreshToken()

    const secure = true;
    const maxAge = ms(process.env.JWT_REFRESH_SECRET_EXPIRE);

    const session = await Session.create({
        refreshToken,
        user: user._id,
        expiresAt: Date.now() + maxAge,
    });

    const token = user.genJwtoken(session._id)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure,
        maxAge,
        sameSite: "none"
    })

    res.status(statusCode).json({
        success: true,
        data: {
            user,
            token
        }
    })

}

export default sendToken