import { ProjectModel } from "./project.model.js";
export const fetchProjects = async (reqQuery) => {
  // Implement the functionality for search, filter and pagination this function.
  //search based on provided keyword

  const queryObj = { ...reqQuery };
  let searchKey = {};
  if (queryObj.searchKeyword) {
    // i to make case insensitive
    const regexPattern = {
      $regex: new RegExp(queryObj.searchKeyword),
      $options: "i",
    };
    searchKey = {
      ...searchKey,
      $or: [{ name: regexPattern }, { description: regexPattern }],
    };
  }
  let query = ProjectModel.find(searchKey).populate({
    path: "author",
  });
  const excludedFields = ["page", "searchKeyword", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  query = query.find(JSON.parse(queryStr));
  const page = reqQuery.page * 1 || 1;
  const limit = reqQuery.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const projects = await query;
  return { projects, limit, page };
};
export const fetchProject = async (id) => {
  return await ProjectModel.findById(id).populate("author");
};
export const editProject = async (filter, body) => {
  return await ProjectModel.findOneAndUpdate(filter, body, {
    new: true,
    runValidators: true,
  });
};
export const deleteProject = async (filter) => {
  return await ProjectModel.findOneAndDelete(filter);
};
export const createNewProject = async (body) => {
  return await ProjectModel.create(body);
};
