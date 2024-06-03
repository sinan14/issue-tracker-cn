import express from "express";
import {
  getProjectPage,
  getCreateProject,
  getProjects,
  createProject,
  getProjectById,
  updateById,
  deleteById,
  viewProject,
  getEditProject,
} from "./project.controller.js";
import { auth } from "../../middlewares/auth.js";
const router = express.Router();
router.route("/").get(getProjects).post(auth, createProject);
router.get("/all-projects", getProjectPage);
router.get("/create-project", auth, getCreateProject);
router
  .route("/:id")
  .get(getProjectById)
  .put(auth, updateById)
  .delete(auth, deleteById);
router.get("/:id/edit-project", auth, getEditProject);
router.get("/:id/get-project-details", viewProject);
export default router;
