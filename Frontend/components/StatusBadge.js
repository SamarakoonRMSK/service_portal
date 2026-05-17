const STATUS_STYLES = {
  Open: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Closed;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}
    >
      {status}
    </span>
  );
}
