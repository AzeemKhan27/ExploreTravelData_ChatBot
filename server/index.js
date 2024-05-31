const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const dataRoutes = require("./routes/StoreData.js");
const dialogflowRoute = require("./routes/dialogflowRoute.js")
const searchRoutes = require("./routes/searchRoutes.js")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/store", dataRoutes);
app.use('/api/v1/dialogflow', dialogflowRoute.router);
app.use('/api/v1/google', searchRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

