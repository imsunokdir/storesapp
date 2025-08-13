const express = require("express");
const { sequelize, User } = require("./tables");
require("dotenv").config();
const sessionMiddleware = require("./configs/session");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");
const storeRouter = require("./routes/store.route");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// app.options(
//   "*",
//   cors({
//     origin: [process.env.CORS_ORIGIN],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/auth", authRoutes);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/store", storeRouter);
sequelize.sync({ alter: true }).then(async () => {
  //   const password = "admin123";
  //   const hashesPassword = await bcrypt.hash(password, 10);
  //   await User.create({
  //     name: "System Admin",
  //     email: "admin@storeapp.com",
  //     password: hashesPassword,
  //     role: "admin",
  //     address: "root",
  //   });
  console.log("Database synced");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
