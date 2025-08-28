import React from "react";
import LinkItem from "./LinkItems.jsx";

export default function LinkList({ links, loadingIds, deleteLink }) {
  if (!links.length)
    return <p className="text-gray-500">No links added yet.</p>;

  return (
    <div className="space-y-2">
      {links.map((item) => (
        <LinkItem
          key={item.id}
          item={item}
          isLoading={loadingIds.has(item.id)}
          deleteLink={deleteLink}
        />
      ))}
    </div>
  );
}
