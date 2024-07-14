"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const planner_1 = require("../controllers/Student/planner");
const tracker_1 = require("../controllers/Student/tracker");
const router = express_1.default.Router();
router.get("/planner/get/:id", checkAuth_1.checkAuth, planner_1.getStudentPlanner);
router.get("/tracker/get/:id", checkAuth_1.checkAuth, tracker_1.getStudentTracker);
exports.default = router;
