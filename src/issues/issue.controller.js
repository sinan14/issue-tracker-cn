import { ErrorHandler } from "../../utils/errorHandler.js";
import {
  createNewIssue,
  deleteIssue,
  editIssue,
  fetchIssue,
  fetchIssues,
  filterIssues,
  updateIssueStatus,
} from "./issues.repository.js";
export const viewIssues = async (req, res) => {
  const { projectId } = req.params;
  const { issues, page, limit } = await fetchIssues(req.query, projectId);
  const data = { title: "issues", issues, page, limit, projectId };

  res.render("issues/issues", data);
};
export const getCreateIssue = async (req, res) => {
  const { projectId } = req.params;
  res.render("issues/create-issue", { title: "create-issue", projectId });
};
export const getEditIssue = async (req, res) => {
  const issue = await fetchIssue(req.params.id);
  const data = { issue, title: "edit-issue", projectId: issue.project };
  res.render("issues/edit-issue", data);
};
export const viewIssue = async (req, res) => {
  const { id, projectId } = req.params;
  const issue = await fetchIssue(id);
  const data = { title: "view-issue", issue, projectId };
  res.render("issues/view-issue", data);
};
export const getIssues = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { issues, page, limit } = await fetchIssues(req.query, projectId);
    res.status(200).json({
      success: true,
      issues,
      page,
      limit,
      projectId,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const filterIssuesAdv = async (req, res, next) => {
  try {
    console.log("entered adv");
    const { projectId } = req.params;
    const { issues, page, limit } = await filterIssues(req.query, projectId);
    res.status(200).json({
      success: true,
      issues,
      page,
      limit,
      projectId,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, labels } = req.body;
    const body = {
      author: req.user._id,
      title,
      description,
      project: req.params.projectId,
      labels,
    };
    if (!title?.trim()) {
      return next(new ErrorHandler(400, "title required"));
    }
    if (!description?.trim()) {
      return next(new ErrorHandler(400, "description required"));
    }
    const newIssue = await createNewIssue(body);
    return res.json({
      success: true,
      issue: newIssue,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await fetchIssue(req.params.id);
    if (!issue) {
      return next(new ErrorHandler(404, "issue not found"));
    }
    return res.json({
      success: true,
      issue,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const updateById = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
      author: req.user._id,
    };
    const body = {};
    const { title, description, labels } = req.body;
    if (title?.trim()) {
      body.title = title;
    }
    if (description?.trim()) {
      body.description = description;
    }
    if (labels) {
      body.labels = labels;
    }

    const issue = await editIssue(filter, body);
    if (!issue) {
      return next(new ErrorHandler(404, "issue not found? action not allowed"));
    }
    return res.json({
      success: true,
      issue,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const updateStatus = async (req, res, next) => {
  try {
    const issue = await updateIssueStatus(
      req.params.id,
      req.body.status,
      req.user._id
    );
    if (!issue) {
      return next(new ErrorHandler(404, "issue not found? action not allowed"));
    }
    return res.json({
      success: true,
      issue,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const deleteById = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
      author: req.user._id,
    };
    const issue = await deleteIssue(filter);
    if (!issue) {
      return next(new ErrorHandler(404, "issue not found"));
    }
    return res.json({
      success: true,
      issue,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
