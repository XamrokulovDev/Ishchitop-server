const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
const connectDB = require('./config/db');
const errorHandle = require('./middlewares/error');

// dotenv config
dotenv.config();

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const corsOptions = {
    origin: "*",
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
  };
// cors middleware
app.use(cors(corsOptions));

// "public/image" file static 
app.use("/uploads", express.static(path.join(__dirname,"public/uploads")));

// Developer tools 
if (process.env.NODE_ENV === "developer") {
    app.use(morgan("dev"));
}

// Connect to DB
connectDB();

// Routes 
app.use('/api/v1/auth', require('./routes/user.route'));
app.use('/api/v1/ads', require('./routes/ads.route'));
app.use('/api/v1/swagger', require('./routes/swagger.route'));
app.use('/', require('./routes/swagger.route'));

// Error Handle Middleware
app.use(errorHandle);

// PORT and Listening 
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Server is running on port ${PORT}`);
})