const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs');
const cors = require('cors');
const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const { initialRole } = require('./app/data/data');

app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next();
});

const orderRouter = require("./app/routes/order.router");
const orderDetailRouter = require("./app/routes/orderDetail.router");
const customerRouter = require("./app/routes/customer.router");
const productRouter = require("./app/routes/product.router");
const categoryRouter = require("./app/routes/category.router");
const authRouter = require('./app/routes/auth.router');
const userRouter = require('./app/routes/user.router');
const voucherRouter = require('./app/routes/voucher.router');
const imageRouter = require('./app/routes/image.router');
const contactRouter = require('./app/routes/contact.router');
// const columnRouter = require('./app/routes/kanban/column.router')
// const taskRouter = require('./app/routes/kanban/task.router');

app.use((req, res, next) => {
    console.log("Current time:", new Date());
    next();
});

app.use((req, res, next) => {
    console.log("Request method:", req.method);
    next();
})

// connect to mongodb database
mongoose.connect(process.env.MONGODB_URL)
    .then(async () => {
        console.log("Connect successfully!");
        await initialRole();
    })
    .catch((error) => {
        console.error("Connect MongoDB Failed!", error);
    })


// create upload folder    
if (!fs.existsSync('./uploadProduct')) {
    // Nếu không, tạo thư mục
    fs.mkdirSync('./uploadProduct');
}
if (!fs.existsSync('./uploadAvatar')) {
    // Nếu không, tạo thư mục
    fs.mkdirSync('./uploadAvatar');
}

app.use("/api", customerRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);
app.use("/api", orderDetailRouter);
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api", voucherRouter);
app.use("/api", imageRouter);
app.use("/api", contactRouter);
// app.use("/api", columnRouter);
// app.use("/api", taskRouter);
// app.use("/api", require('./app/routes/kanban/index'));

app.listen(process.env.SERVER_PORT, () => {
    console.log("App listening on port:", process.env.SERVER_PORT);
})

module.exports = app;