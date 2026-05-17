const { validationResult } = require("express-validator");
const JobRequest = require("../models/JobRequest");
const { formatValidationErrors } = require("../utils/validation");

const VALID_STATUSES = ["Open", "In Progress", "Closed"];

async function getJobs(req, res, next) {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const jobs = await JobRequest.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
}

async function getJobById(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const job = await JobRequest.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
}

async function createJob(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const job = new JobRequest({
      ...req.body,
      createdBy: req.user._id,
    });

    await job.save();
    await job.populate("createdBy", "name email");

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
}

async function updateJobStatus(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = req.body.status;
    await job.save();
    await job.populate("createdBy", "name email");

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
}

async function deleteJob(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: formatValidationErrors(errors) });
    }

    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  VALID_STATUSES,
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
};
