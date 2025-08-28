import React, { useState } from "react";

export default function LinkInput({ onAdd }) {
  const [text, setText] = useState("");
  const [fetchDns, setFetchDns] = useState(false);

  function handleAdd() {
    if (!text.trim()) return;
    onAdd(text, { fetchDns });
    setText("");
  }

  return (
    <div className="mb-4">
      <textarea
        className="w-full p-3 border rounded-md resize-y"
        placeholder="Paste links here (comma, space, or newline separated)"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={fetchDns}
            onChange={(e) => setFetchDns(e.target.checked)}
          />
          <span className="text-sm">Fetch DNS</span>
        </label>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Links
        </button>
      </div>
    </div>
  );
}
