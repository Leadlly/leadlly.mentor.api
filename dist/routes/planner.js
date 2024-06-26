"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const planner_1 = require("../controllers/planner");
const checkAuth_1 = require("../middlewares/checkAuth");
const router = express_1.default.Router();
router.post('/create', checkAuth_1.checkAuth, planner_1.createPlanner);
exports.default = router;
