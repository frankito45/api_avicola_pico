import express from "express";
import cors from 'cors';
import stock from "./routes/stock.js";





const app = express();

// middleware to parse JSON bodies
app.use(express.json());
app.disable('x-powered-by');
app.use(cors());

app.use('/granjapico',stock)

export default app





