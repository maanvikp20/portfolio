// plain-text excerpt from Markdown, for cards and meta descriptions
export function excerptFrom(markdown = "", max = 160) {
  const text = String(markdown)
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/^\s*\|.*\|\s*$/gm, " ") // table rows
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1") // bold / italic / strike
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}
