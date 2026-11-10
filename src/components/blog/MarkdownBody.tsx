export function MarkdownBody({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`md-body ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
