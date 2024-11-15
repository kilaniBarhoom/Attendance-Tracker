import mongoose from "mongoose";
import User from "../models/user.js";

const connectDB = async (URI) => {
    mongoose.set("strictQuery", false);
    createAdmin();
    await mongoose.connect(URI);

};

const createAdmin = async () => {
    mongoose.connection.once("open", async () => {
        console.log("Connection to the Database was established successfully 🌍");
        const count = await User.countDocuments().exec();
        if (count === 0) {
            const Admin = {
                fullNameEnglish: process.env.ADMIN_FULL_NAME_ENGLISH,
                fullNameArabic: process.env.ADMIN_FULL_NAME_ARABIC,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: "superadmin",
            }
            try {
                const user = new User(Admin);
                await User.create(user);
                console.log("Admin Account Created 🌍");
            } catch (error) {
                console.log(error);
            }
        }
    }
    );
}

export default connectDB;