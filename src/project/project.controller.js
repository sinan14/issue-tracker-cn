import { ErrorHandler } from "../../utils/errorHandler.js";
import {
  createNewProject,
  deleteProject,
  editProject,
  fetchProject,
  fetchProjects,
} from "./project.repository.js";
import { fetchIssues } from "./../issues/issues.repository.js";
export const getProjectPage = async (req, res) => {
  const { projects, page, limit } = await fetchProjects(req.query);
  res.render("projects/projects", { projects, page, limit, title: "projects" });
};
export const getCreateProject = async (req, res) => {
  res.render("projects/create-project", { title: "create-project" });
};
export const getEditProject = async (req, res) => {
  const project = await fetchProject(req.params.id);
  res.render("projects/edit-project", { title: "edit-project", project });
};
export const getProjects = async (req, res, next) => {
  try {
    const { projects, page, limit } = await fetchProjects(req.query);
    res.status(200).json({
      success: true,
      projects,
      page,
      limit,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return next(new ErrorHandler(400, "project name required"));
    }
    if (!description?.trim()) {
      return next(new ErrorHandler(400, "description required"));
    }
    const body = {
      name,
      description,
      author: req.body.author || req.user._id,
    };
    const project = await createNewProject(body);
    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const getProjectById = async (req, res, next) => {
  try {
    const project = await fetchProject(req.params.id);
    if (!project) {
      return next(new ErrorHandler(404, "project not found"));
    }
    return res.json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const viewProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await fetchProject(id);
    let issues = [];
    if (project) {
      issues = (await fetchIssues(req.query, id)).issues;
    }
    res.render("projects/view-project", {
      project,
      title: "view-project",
      projectId: id,
      issues,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const updateById = async (req, res, next) => {
  try {
    const filter = {
      author: req.user._id,
      _id: req.params.id,
    };
    const { name, description } = req.body;
    const project = await editProject(filter, { name, description });
    if (!project) {
      return next(
        new ErrorHandler(404, "project not found / action not allowed")
      );
    }
    return res.json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const deleteById = async (req, res, next) => {
  try {
    const filter = {
      author: req.user._id,
      _id: req.params.id,
    };
    const project = await deleteProject(filter);
    if (!project) {
      return next(
        new ErrorHandler(404, "project not found / action not allowed")
      );
    }
    return res.json({
      success: true,
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
