const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
    {
        title:{ type: String },
        description:{ type: String },
        email: { type: String, required: true },
        status:{ type: String },
        createdAt:{ type: Date, default: Date.now },
    },
    { versionKey: false }
);

const TodoModel = mongoose.model("todos", TodoSchema);
module.exports = TodoModel;
