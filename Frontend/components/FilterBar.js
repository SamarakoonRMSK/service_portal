"use client";

const CATEGORIES = [
  "All",
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Carpentry",
  "Roofing",
  "Landscaping",
  "Other",
];

const STATUSES = ["All", "Open", "In Progress", "Closed"];

export default function FilterBar({
  category,
  status,
  search,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
  onSearch,
  loading,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="field-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="field-select"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
            Keyword
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title or description..."
            className="field-input"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </form>
  );
}
