import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_LINK_CONNECTION)
    .then((result) => {
      console.log(`connection to DB is successfully`);
    })
    .catch((err) => {
      console.log(`there is an error in DB connection ...${err}`);
    });
};

export default connectDB;
