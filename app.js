const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/userRoute");
const { authenticate } = require("./middlewares/authentication");
const { apiDataRouter } = require("./routes/apiData");
const { secureRouter } = require("./routes/secureRoute");
const { ethereumRouter } = require("./routes/ethereumBal");
// const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.send(`
          <h1>Welcome to the Quiz Application.</h1>
    `);
});

app.use("/user", userRouter);
app.use("/api", apiDataRouter);
app.use("/ethereum", ethereumRouter);

app.use(authenticate);

app.use("/secure", secureRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${PORT}`);
});
