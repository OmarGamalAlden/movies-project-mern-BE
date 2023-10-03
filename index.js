import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initApp } from "./src/app.router.js";
import * as dotenv from "dotenv";

const _dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(_dirname, "./config/.env") }); //run .env enviroment.

const app = express(); //to run express server
initApp(app, express); //All applicition connection is here, to keep the main file "index.js" organized and sample.
