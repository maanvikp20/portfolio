import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// map typography colors onto the site's theme variables so light/dark just work
const themed = [
  "[--tw-prose-body:var(--text-primary)]",
  "[--tw-prose-headings:var(--text-primary)]",
  "[--tw-prose-bold:var(--text-primary)]",
  "[--tw-prose-links:var(--text-primary)]",
  "[--tw-prose-code:var(--text-primary)]",
  "[--tw-prose-quotes:var(--text-secondary)]",
  "[--tw-prose-captions:var(--text-secondary)]",
  "[--tw-prose-counters:var(--text-secondary)]",
  "[--tw-prose-bullets:var(--text-secondary)]",
  "[--tw-prose-hr:rgba(var(--overlay-color),0.15)]",
  "[--tw-prose-quote-borders:rgba(var(--overlay-color),0.25)]",
  "[--tw-prose-th-borders:rgba(var(--overlay-color),0.25)]",
  "[--tw-prose-td-borders:rgba(var(--overlay-color),0.12)]",
].join(" ");

// renders Markdown safely (raw HTML in posts is not allowed)
export default function Markdown({ children }) {
  return (
    <div
      className={`prose prose-neutral max-w-none md:prose-lg prose-headings:font-normal prose-headings:font-[family-name:var(--font-instrument-serif)] ${themed}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = /^https?:\/\//i.test(href || "");
            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              className="rounded-xl"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
