import assetRouter from './route/asset.router.js'
import express from 'express'
import requestLogger from './middleware/requestMiddleware.js';

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use("/api/assets", assetRouter);

app.get("/", (req, res) => {
  res.status(200).send("Server is running")
})

export default app;