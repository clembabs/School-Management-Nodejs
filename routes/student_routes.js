const express = require("express");

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
} from "../controllers/student_controller";

const router = express.Router();

router.get("/", getStudents);
router.get("/", getStudent);
router.post("/", createStudent);
router.put("/", updateStudent);
router.delete("/", deleteStudent);

module.exports = router;
