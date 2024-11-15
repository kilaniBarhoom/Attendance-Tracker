import { Schema, model } from "mongoose";

const SessionSchema = new Schema({
    refreshToken: {
        type: String,
        required: [true, "Please provide a refresh token"],
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    expiresAt: {
        type: Date,
        required: [true, "Please provide an expiration date"],
    },
}, {
    timestamps: true,
});

const Session = model("Session", SessionSchema);

export default Session;