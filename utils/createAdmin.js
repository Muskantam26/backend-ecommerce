import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  const adminExists = await User.findOne({ role: "SUPER-ADMIN" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    await User.create({
      name: "Super-Admin",
      email: "superadmin12@gmail.com",
      password: hashedPassword,
      role: "SUPER-ADMIN"
    });

    console.log(" Default Admin Created");
  } else {
    console.log("Admin already exists");
  }
};
export default createAdmin;