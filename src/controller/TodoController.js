const TodoModel = require("../models/TodoModel");

// Create Todo
exports.createTodo = async (req, res) => {
  try {
    const reqBody = req.body;
    reqBody.email = req.headers.email;
    const todo = await TodoModel.create(reqBody);
    res.status(200).json({ status: "success", data: todo });
  } catch (error) {
    res.status(200).json({ status: "fail", data: error });
  }
};

//Update Todo
exports.UpdateTodoStatus = async (req,res) => {
  try{
    
    const id = req.params.id;
    const status = req.params.status;
    const query = { _id: id };
    const body = {status: status};
    const todo = await TodoModel.updateOne(query, body);
    res.status(200).json({ status: "success", data: todo });

  }catch(error){
    res.status(200).json({ status: "fail", data: error });
  }
}

//Delete Todo
exports.DeleteTodo = async (req,res) => {
  try{
    
    const id = req.params.id;
    const query = { _id: id };
    const todo = await TodoModel.deleteOne(query);
    res.status(200).json({ status: "success", data: todo });

  }catch(error){
    res.status(200).json({ status: "fail", data: error });
  }
}

//Todo List By Status
exports.TodoListByStatus = async (req,res) => {
  try{
    
     const status = req.params.status;
     const email = req.headers.email;

     const result = await TodoModel.aggregate(
      [
        { $match: {status: status , email: email }},
        { $project: {_id: 1, title: 1, description: 1, status: 1, createDate: 1}}
      ]
     )
      res.status(200).json({ status: "success", data: result });

  }catch(error){
    res.status(200).json({ status: "fail", data: error });
  }
}

//Todo Count By Status
exports.TodoCountByStatus = async (req,res) => {
  try{
  
     const email = req.headers.email;

     const result = await TodoModel.aggregate(
      [
        { $match: {email: email }},
        { $group: {_id: "$status", count: {$count: {} }}},
      ]
     )
      res.status(200).json({ status: "success", data: result });

  }catch(error){
    res.status(200).json({ status: "fail", data: error });
  }
}