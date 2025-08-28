import React, { useState, useEffect } from "react";
import LinkInput from "./components/LinkInput";
import Controls from "./components/Controls";
import LinkList from "./components/LinkList";
import { parseUrlsFromText } from "./utils/url";
import { resolveDomain } from "./api/dns";

export default function App() {
  const [links, setLinks] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set());

  // Load links from localStorage only once on mount
  useEffect(() => {
    const savedLinks =
      JSON.parse(localStorage.getItem("linkSorterLinks")) || [];
    console.log("Loaded from localStorage:", savedLinks);
    setLinks(savedLinks);
  }, []);

  // Save links to localStorage whenever they change but if links length > 0
  useEffect(() => {
    // console.log("Saving to localStorage:", links);
    if (links.length > 0) {
      localStorage.setItem("linkSorterLinks", JSON.stringify(links));
    }
  }, [links]);

  function addLinksFromText(text, { fetchDns }) {
    const parsed = parseUrlsFromText(text);

    // Assign unique IDs ONLY when adding new links
    const newItems = parsed.map((p) => ({
      id: crypto.randomUUID(), // 🔥 Better unique ID
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
    localStorage.removeItem("linkSorterLinks"); // clear localStorage
  }

  const deleteLink = (item) => {
    const updatedLinks = links.filter((link) => link.id !== item.id);
    setLinks(updatedLinks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">
          🔗 Link Sorter
        </h1>
        <LinkInput onAdd={addLinksFromText} />
        <Controls
          onSortAlpha={sortAlpha}
          onSortDomain={sortDomain}
          onClear={clearAll}
          links={links}
        />
        <LinkList
          links={links}
          loadingIds={loadingIds}
          deleteLink={deleteLink}
        />
      </div>
    </div>
  );
}
