"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middlewares/checkAuth");
const index_1 = require("../controllers/User/index");
const router = express_1.default.Router();
router.post("/info/save", checkAuth_1.checkAuth, index_1.mentorlInfo);
exports.default = router;
