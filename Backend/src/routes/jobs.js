const express = require("express");
const { body, param, query } = require("express-validator");
const authenticate = require("../middleware/auth");
const {
  VALID_STATUSES,
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobsController");

const router = express.Router();

// Public — browse jobs without login
router.get(
  "/",
  [
    query("category").optional().trim(),
    query("status").optional().trim(),
    query("search").optional().trim(),
  ],
  getJobs
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid job ID")],
  getJobById
);

// Protected — create and update require JWT
router.post(
  "/",
  authenticate,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("contactEmail")
      .optional({ values: "falsy" })
      .trim()
      .matches(/^\S+@\S+\.\S+$/)
      .withMessage("Please enter a valid email address"),
  ],
  createJob
);

router.patch(
  "/:id",
  authenticate,
  [
    param("id").isMongoId().withMessage("Invalid job ID"),
    body("status")
      .isIn(VALID_STATUSES)
      .withMessage('Status must be one of "Open", "In Progress", or "Closed"'),
  ],
  updateJobStatus
);

// Protected — delete requires JWT
router.delete(
  "/:id",
  authenticate,
  [param("id").isMongoId().withMessage("Invalid job ID")],
  deleteJob
);

module.exports = router;
