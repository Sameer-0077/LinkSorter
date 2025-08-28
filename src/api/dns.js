export async function resolveDomain(domain) {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(
    domain
  )}&type=A`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DNS request failed: ${res.status}`);
  const data = await res.json();
  const ips = (data.Answer || [])
    .filter((a) => a.type === 1)
    .map((a) => a.data);
  return { domain, ips, raw: data };
}
