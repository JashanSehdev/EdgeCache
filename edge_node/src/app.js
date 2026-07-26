import fileRouter from './route/asset.router.js'
import express from 'express'

const app = express();

app.use(express.json());

app.use("/api/assets", fileRouter);
app.get("/", (req, res) => {
  res.status(200).send("Server is running")
})

export default app;