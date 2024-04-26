import mongoose from "mongoose";

const plannerSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId
    },
    date: String,
    day: String,
    topics: [],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Planner = mongoose.model("Planner", plannerSchema)

export default Planner