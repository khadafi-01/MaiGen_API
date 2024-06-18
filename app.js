require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
// const { loadModel, getRecommendations: getModelRecommendations } = require('./handlers/modelController');
const preferenceRoute = require("./routes/preferenceRoute");

// Middleware express.json() untuk mem-parsing body permintaan dalam format JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        status: "Success",
        message: "REST APIs are working",
    });
});

// app.get('/loadmodel', loadModel);
// app.post('/getRecommendations', getModelRecommendations);

// Daftarkan route
app.use("/auth", userRouter);
app.use("/user", userRouter);
app.use("/preference", preferenceRoute);

app.use("*", (req, res, next) => {
    res.status(404).json({
        status: "Fail",
        message: "Route not found",
    });
});

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});