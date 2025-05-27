const express = require('express');
const UserController = require('../controller/UserController');
const TodoController = require('../controller/TodoController');
const AuthVerificationMiddleware = require('../middileware/AuthVerificationMiddleware');
const router = express.Router();

//users
router.post('/create-user', UserController.createUser);
router.post('/login', UserController.Login); 
router.post('/profile-update', AuthVerificationMiddleware, UserController.ProfileUpdate);
router.get('/profile-details', AuthVerificationMiddleware, UserController.ProfileDetails);
router.post('/recover-verify-email/:email', UserController.RecoverVerifyEmail);
router.post('/otp-verify/:email/:otp', UserController.OtpVerify);
router.post('/reset-password', UserController.ResetPassword);


//Todo
router.post('/create-todo', AuthVerificationMiddleware, TodoController.createTodo);
router.patch('/update-todo-status/:id/:status', AuthVerificationMiddleware, TodoController.UpdateTodoStatus);
router.delete('/delete-todo/:id', AuthVerificationMiddleware, TodoController.DeleteTodo);
router.get('/todo-list-by-status/:status', AuthVerificationMiddleware, TodoController.TodoListByStatus);
router.get('/todo-count-by-status', AuthVerificationMiddleware, TodoController.TodoCountByStatus);

module.exports = router;

