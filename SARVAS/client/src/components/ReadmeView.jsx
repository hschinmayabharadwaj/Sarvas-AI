import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';

// A repository README as GitHub-flavoured Markdown, built as React elements.
// Raw HTML in the README is dropped, never injected. Images show as their alt
// text: the CSP only allows our own images (README images could track viewers).
// Relative links point at the file on GitHub.
const components = {
  a: ({ node, ...p }) => <a {...p} target="_blank" rel="noopener noreferrer" />,
  img: ({ alt }) => (alt ? <span className="tag">{alt}</span> : null),
  pre: ({ node, ...p }) => <pre className="code" {...p} />,
  // Table alignment arrives as an inline style, which the CSP blocks.
  th: ({ node, style, ...p }) => <th {...p} />,
  td: ({ node, style, ...p }) => <td {...p} />,
};

export default function ReadmeView({ owner, name, text }) {
  const base = `https://github.com/${owner}/${name}/blob/HEAD/README.md`;
  const urlTransform = (url) => {
    const safe = defaultUrlTransform(url); // '' for javascript: and other unsafe schemes
    if (!safe) return '';
    try { return new URL(safe, base).href; } catch { return ''; }
  };
  return (
    <div className="readme">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components} urlTransform={urlTransform}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
