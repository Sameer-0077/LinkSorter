import React, { useState, useEffect } from "react";
import LinkInput from "./components/LinkInput";
import Controls from "./components/Controls";
import LinkList from "./components/LinkList";
import { parseUrlsFromText } from "./utils/url";
import { resolveDomain } from "./api/dns";

export default function App() {
  const [links, setLinks] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());

  // 🔹 Load links from localStorage on app mount
  useEffect(() => {
    const saved = localStorage.getItem("linkSorterLinks");
    if (saved) {
      setLinks(JSON.parse(saved));
    }
  }, []);

  // 🔹 Save links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("linkSorterLinks", JSON.stringify(links));
  }, [links]);

  function addLinksFromText(text, { fetchDns }) {
    const parsed = parseUrlsFromText(text);
    const newItems = parsed.map((p, i) => ({
      id: Date.now() + i,
      url: p.url,
      domain: p.domain,
      dns: null,
    }));

    setLinks((prev) => [...newItems, ...prev]);

    if (fetchDns) {
      newItems.forEach((item) => fetchDnsForItem(item));
    }
  }

  async function fetchDnsForItem(item) {
    setLoadingIds((s) => new Set(s).add(item.id));
    try {
      const dns = await resolveDomain(item.domain);
      setLinks((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, dns } : l))
      );
    } catch (err) {
      setLinks((prev) =>
        prev.map((l) =>
          l.id === item.id ? { ...l, dns: { error: err.message } } : l
        )
      );
    } finally {
      setLoadingIds((s) => {
        const copy = new Set(s);
        copy.delete(item.id);
        return copy;
      });
    }
  }

  function sortAlpha() {
    setLinks((prev) => [...prev].sort((a, b) => a.url.localeCompare(b.url)));
  }

  function sortDomain() {
    setLinks((prev) =>
      [...prev].sort((a, b) => a.domain.localeCompare(b.domain))
    );
  }

  function clearAll() {
    setLinks([]);
    localStorage.removeItem("linkSorterLinks"); // 🔹 Also clear storage
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">🔗 Link Sorter</h1>
        <LinkInput onAdd={addLinksFromText} />
        <Controls
          onSortAlpha={sortAlpha}
          onSortDomain={sortDomain}
          onClear={clearAll}
          links={links}
        />
        <LinkList links={links} loadingIds={loadingIds} />
      </div>
    </div>
  );
}
