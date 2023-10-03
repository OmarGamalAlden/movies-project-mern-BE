import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import cors from "cors";

export const initApp = (app, express) => {
  //for receiving request form my front-end!!!
  let whiteList = ["https://omargamalalden.github.io"]; //fron-end links
  let corsOptions = {
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
  };
  app.use(cors(corsOptions));

  //convert buffer data
  app.use(express.json({}));

  //Routing
  app.use("/auth", authRouter);

  //Global error handling
  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    return res.status(status).json({ error: message });
  });

  //connect to database
  connectDB();

  //run project server..
  app.listen(process.env.PORT_NUMBER, () => {
    console.log(`server is running in port.....${process.env.PORT_NUMBER}`);
  });
};
