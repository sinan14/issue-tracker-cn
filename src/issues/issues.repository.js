import mongoose from "mongoose";
import { IssueModel } from "./issue.model.js";

export const editIssue = async (filter, body) => {
  return await IssueModel.findOneAndUpdate(filter, body, {
    new: true,
    runValidators: true,
  });
};
export const updateIssueStatus = async (id, status, userId) => {
  const issue = await IssueModel.findById(id).populate("project");
  if (issue.project?.author?.toString() == userId) {
    // edit the label
    issue.status = status;
    await issue.save();
    return issue;
  }
  return null;
};
export const deleteIssue = async (filter) => {
  return await IssueModel.findOneAndDelete(filter);
};
export const createNewIssue = async (body) => {
  return await IssueModel.create(body);
};
export const fetchIssue = async (id) => {
  const issue = await IssueModel.findOne({ _id: id })
    .populate("author")
    .populate("project");
  return issue;
};

export const fetchIssues = async (reqQuery, projectId) => {
  const queryObj = { ...reqQuery };
  let searchKey = {
    project: projectId,
  };
  if (queryObj.searchKeyword) {
    // i to make case insensitive
    const regexPattern = {
      $regex: new RegExp(queryObj.searchKeyword),
      $options: "i",
    };
    searchKey = {
      ...searchKey,
      $or: [{ title: regexPattern }, { description: regexPattern }],
    };
  }
  let query = IssueModel.find(searchKey).populate("author");
  const excludedFields = ["page", "searchKeyword", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  query = query.find(JSON.parse(queryStr));
  const page = reqQuery.page * 1 || 1;
  const limit = reqQuery.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const issues = await query.lean();

  return { issues, limit, page };
};

export const filterIssues = async (reqQuery, projectId) => {
  const queryObj = { ...reqQuery };
  let searchKey = {
    project: new mongoose.Types.ObjectId(projectId),
  };
  if (queryObj.searchKeyword) {
    const regexPattern = {
      $regex: new RegExp(queryObj.searchKeyword),
      $options: "i",
    };
    searchKey.$or = [{ title: regexPattern }, { description: regexPattern }];
  }
  const pipeline = [
    { $match: searchKey },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
  ];

  if (queryObj.labels) {
    const labels = queryObj.labels;
    delete queryObj.labels;
    if (Array.isArray(labels)) {
      pipeline.push({
        $match: {
          labels: { $in: labels },
        },
      });
    }
  }

  if (queryObj.author) {
    const author = queryObj.author;
    delete queryObj.author;
    pipeline.push({ $match: { "author.name": author } });
  }

  const excludedFields = ["page", "searchKeyword", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const additionalMatch = JSON.parse(queryStr);
  if (Object.keys(additionalMatch).length > 0) {
    pipeline.push({ $match: additionalMatch });
  }

  const page = reqQuery.page * 1 || 1;
  const limit = reqQuery.limit * 1 || 100;
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip }, { $limit: limit });
  console.log("Final Pipeline:", JSON.stringify(pipeline, null, 2));
  const issues = await IssueModel.aggregate(pipeline).exec();

  return { issues, limit, page };
};
