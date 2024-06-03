import express from "express";
import { auth, authByUserRole } from "../../../middlewares/auth.js";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getLogin,
  getSignup,
  getUserDetails,
  getUserDetailsForAdmin,
  logoutUser,
  updatePassword,
  updateUserProfile,
  updateUserProfileAndRole,
  userLogin,
} from "../controller/user.controller.js";

const router = express.Router();

// User POST Routes
router.route("/signup").get(getSignup).post(createNewUser);
router.route("/login").get(getLogin).post(userLogin);

// User PUT Routes
router.route("/password/update").put(auth, updatePassword);
router.route("/profile/update").put(auth, updateUserProfile);

// User GET Routes
router.route("/details").get(auth, getUserDetails);
router.route("/logout").get(auth, logoutUser);

// Admin GET Routes
router.route("/admin/allusers").get(auth, authByUserRole("admin"), getAllUsers);
router
  .route("/admin/details/:id")
  .get(auth, authByUserRole("admin"), getUserDetailsForAdmin);

// Admin DELETE Routes
router
  .route("/admin/delete/:id")
  .delete(auth, authByUserRole("admin"), deleteUser);

// Admin PUT Routes
// Implement route for updating role of other users
// Write your code here
router
  .route("/admin/update/:id")
  .put(auth, authByUserRole("admin"), updateUserProfileAndRole);

export default router;
