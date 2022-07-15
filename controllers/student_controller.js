const asyncHandler = require("express-async-handler");
const StudentModel = require("../models/students");
const User = require('../models/user')

// @desc    Get Students
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  const students = await StudentModel.find({});
  try {
    res.status(200).json({
      status: "Success",
      data: {
        students,
      },
    });
    console.log(students);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

// @desc    Get studentByID
// @route   GET /api/student/:id
// @access  Private

const getStudent = asyncHandler(async (req, res) => {
  let id = req.params.id;
  const student = await StudentModel.findById(id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(200).json({
      status: "Success",
      data: {
        student,
      },
    });
    console.log(student);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

// @desc    Create Student
// @route   POST /api/add-student
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const faculty = req.body.faculty;
  const department = req.body.department;
  const level = req.body.level;

  const student = new StudentModel({
    firstName: firstName,
    lastName: lastName,
    faculty: faculty,
    department: department,
    level: level,
    user: req.user.id
  });

  try {
    await student.save();
    res.status(201).json({
      status: "Success",
      data: {
        student,
      },
    });
    console.log(student);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

// @desc    Update student
// @route   PUT /api/edit-student/:id
// @access  Private

const updateStudent = asyncHandler(async (req, res) => {
  const student = await StudentModel.findById(req.params.id);

  if (!student) {
    res.status(400);
    throw new Error("Student not found");
  }

  let id = req.params.id;

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("Student not found");
  }

  // Make sure the logged in user matches the student user
  if (student.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedStudent = await StudentModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  try {
    res.status(200).json({
      status: "Success",
      data: {
        updatedStudent,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

// @desc    Delete Student
// @route   DELETE /api/delete-student/:id
// @access  Private

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await StudentModel.findById(req.params.id);

  if (!student) {
    res.status(400);
    throw new Error("User not found");
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Make sure the logged in user matches the student user
  if (student.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await student.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
