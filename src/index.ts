import cors from "cors";
import express, { urlencoded } from "express";
import helmet from "helmet";
import { mainRouter } from "./routes/main-router";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://lumina.arthurdevleal.tech",
  })
);

app.use(express.json());

app.use(mainRouter);

app.get("/", (req, res) => {
  res.json("hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
