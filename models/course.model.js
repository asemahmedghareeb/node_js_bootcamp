import mongoose from "mongoose";
//creating the schema
const courseSchmea = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
//creating the model
const courseModel = mongoose.model("Course", courseSchmea);
export default courseModel;