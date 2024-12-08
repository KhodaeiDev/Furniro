const express = require("express");
const path = require("path");
const { setHeaders } = require("./middleware/setHeaders");

// Routers
const authRouter = require("./routes/auth");

const app = express();

app.use(setHeaders);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/images", express.static(path.resolve(__dirname, "public/images")));

app.use("/auth", authRouter);

module.exports = app;
