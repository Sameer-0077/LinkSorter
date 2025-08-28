import React from "react";

export default function LinkItem({ item, isLoading }) {
  return (
    <div className="p-3 border rounded flex flex-col">
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
  );
}
