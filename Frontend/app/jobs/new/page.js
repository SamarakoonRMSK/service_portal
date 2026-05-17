"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { createJob, getErrorMessage } from "../../../lib/api";

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Carpentry",
  "Roofing",
  "Landscaping",
  "Other",
];

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function NewJobPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    location: "",
    contactName: "",
    contactEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/jobs/new");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return <p className="text-gray-500">Checking authentication...</p>;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      nextErrors.description = "Description must be at least 20 characters";
    }

    if (form.contactEmail.trim() && !EMAIL_REGEX.test(form.contactEmail.trim())) {
      nextErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim() || undefined,
        contactName: form.contactName.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
      };

      await createJob(payload);
      router.push("/?created=true");
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((item) => {
          fieldErrors[item.field] = item.message;
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to jobs
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Post a Job</h1>
        <p className="mt-1 text-gray-600">
          Describe the work you need and we will list it for local tradespeople.
        </p>
      </div>

      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5"
        noValidate
      >
        <Field
          label="Title"
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          error={errors.title}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className={`field-input min-h-[120px] ${
              errors.description ? "border-red-400" : ""
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="field-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          error={errors.location}
        />

        <Field
          label="Contact Name"
          name="contactName"
          value={form.contactName}
          onChange={handleChange}
          error={errors.contactName}
        />

        <Field
          label="Contact Email"
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          error={errors.contactEmail}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Submitting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`field-input ${error ? "border-red-400" : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
