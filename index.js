const path = require('path');
require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const studentRoutes = require("./controllers/student_controller");
const authRoutes = require("./controllers/user_controller");
const port = process.env.PORT || 3001
const { errorHandler } = require('./middleware/errorMiddleware')
const { protect } = require("./middleware/authMiddleware");

//Database connection
connection();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//Auth Routes
app.use("/register",authRoutes.registerUser);
app.use("/login",authRoutes.loginUser);
app.use("/user", protect, authRoutes.getMe);


//Student routes
app.use("/students", protect, studentRoutes.getStudents);
app.use("/student/:id",studentRoutes.getStudent);
app.use("/add-student", protect,studentRoutes.createStudent);
app.use("/edit-student/:id",protect, studentRoutes.updateStudent);
app.use("/delete-student/:id",protect, studentRoutes.deleteStudent);
app.all("*", (req, res) => res.send("That route doesnt exist"));

//Serve Frontend
if(process.env.NODE_ENV === 'production' ) {
  app.use(express.static(path.join(__dirname,'..frontend/build')))

  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname,'../','frontend','build','index.html')))
} else {
  app.get('/', (req,res) => res.send('Please set to Production'))
}

app.use(errorHandler)


app.listen(port,() =>console.log(`Listening on port ${port}...`));

