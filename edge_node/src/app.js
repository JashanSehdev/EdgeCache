import fileRouter from './route/asset.router.js'
import express from 'express'
import requestLogger from './middleware/requestMiddleware.js';
import { errorMiddleWare } from './middleware/errorMiddleware.js';

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use("/api/assets", fileRouter);
app.get("/", (req, res) => {
  res.status(200).send("Server is running")
})

app.use(errorMiddleWare);

export default app;