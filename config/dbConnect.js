import mongoose from "mongoose";

const dbConnect = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.error(`DB Connection Failed`);
    console.error(error);
    process.exit(1);
  }
};

export default dbConnect;
