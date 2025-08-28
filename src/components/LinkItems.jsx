import React from "react";

export default function LinkItem({ item, isLoading, deleteLink }) {
  return (
    <div className="flex justify-between items-center border rounded ">
      <div className="p-3 flex flex-col">
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 break-all"
        >
          {item.url}
        </a>
        <div className="text-xs text-gray-500">Domain: {item.domain}</div>
        <div className="text-xs text-gray-500">
          {isLoading
            ? "Checking DNS..."
            : item.dns
            ? item.dns.error
              ? `DNS error: ${item.dns.error}`
              : `IPs: ${item.dns.ips.join(", ") || "None"}`
            : "DNS not fetched"}
        </div>
      </div>
      <button
        className="p-3 font-medium text-red-400 hover:text-red-500"
        onClick={(e) => deleteLink(item)}
      >
        Delete
      </button>
    </div>
  );
}
