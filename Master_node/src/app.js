import assetRouter from './route/asset.router.js'
import express from 'express'
import requestLogger from './middleware/requestMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use("/api/v1", assetRouter);

app.get("/", (req, res) => {
  res.status(200).send("Server is running")
})


app.use(errorMiddleware)

export default app;