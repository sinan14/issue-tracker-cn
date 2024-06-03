import express from "express";
import { auth } from "../../middlewares/auth.js";
import {
  createIssue,
  deleteById,
  filterIssuesAdv,
  getCreateIssue,
  getEditIssue,
  getIssueById,
  getIssues,
  updateById,
  updateStatus,
  viewIssue,
  viewIssues,
} from "./issue.controller.js";
const router = express.Router();
router.get("/:projectId/filter-issues", filterIssuesAdv);
router.route("/:projectId").get(getIssues).post(auth, createIssue);
router.get("/:projectId/get-issues", viewIssues);
router.get("/:projectId/get-create-issue", auth, getCreateIssue);

router
  .route("/:projectId/:id")
  .get(getIssueById)
  .put(auth, updateById)
  .delete(auth, deleteById);
router.get("/:projectId/:id/get-issue-details", viewIssue);
router.get("/:projectId/:id/get-edit-issue", auth, getEditIssue);
router.put("/:projectId/:id/update-status", auth, updateStatus);

export default router;
