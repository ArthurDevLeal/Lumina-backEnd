import cors from "cors";
import express, { urlencoded } from "express";
import helmet from "helmet";
import { mainRouter } from "./routes/main-router";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "https://lumina.arthurdevleal.tech",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Content-Length", "X-Request-Id"],
    credentials: true,
    optionsSuccessStatus: 204, 
    maxAge: 86400, 
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.options("*", cors());

// 5. Suas rotas
app.use(mainRouter);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});