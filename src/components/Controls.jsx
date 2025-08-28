import React from "react";

export default function Controls({
  onSortAlpha,
  onSortDomain,
  onClear,
  links,
}) {
  function copyToClipboard() {
    const text = links.map((l) => l.url).join("\n");
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
  }

  function exportCSV() {
    const rows = [["URL", "Domain", "IPs"]];
    links.forEach((l) =>
      rows.push([l.url, l.domain, (l.dns?.ips || []).join("|")])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "links.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={onSortAlpha}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Sort A→Z
      </button>
      <button
        onClick={onSortDomain}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Sort by Domain
      </button>
      <button
        onClick={copyToClipboard}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Copy
      </button>
      <button
        onClick={exportCSV}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Export CSV
      </button>
      <button
        onClick={onClear}
        className="ml-auto px-3 py-2 font-medium bg-red-200 text-red-500 rounded hover:text-red-600 hover:"
      >
        Clear All
      </button>
    </div>
  );
}
