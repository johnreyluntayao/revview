import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;

  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const external = /^https?:\/\//.test(href);
      return (
        <Link
          key={index}
          href={href}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </Link>
      );
    }

    return part;
  });
}

interface ContentBlock {
  type: "paragraph" | "heading2" | "heading3" | "quote" | "unordered" | "ordered";
  lines: string[];
}

function parseBlocks(content: string) {
  const blocks: ContentBlock[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", lines: [paragraph.join(" ")] });
      paragraph = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      return;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "heading3", lines: [line.slice(4)] });
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "heading2", lines: [line.slice(3)] });
      return;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ type: "quote", lines: [line.slice(2)] });
      return;
    }

    if (/^[-*] /.test(line)) {
      flushParagraph();
      const previous = blocks.at(-1);
      if (previous?.type === "unordered") previous.lines.push(line.slice(2));
      else blocks.push({ type: "unordered", lines: [line.slice(2)] });
      return;
    }

    if (/^\d+\. /.test(line)) {
      flushParagraph();
      const item = line.replace(/^\d+\. /, "");
      const previous = blocks.at(-1);
      if (previous?.type === "ordered") previous.lines.push(item);
      else blocks.push({ type: "ordered", lines: [item] });
      return;
    }

    paragraph.push(line);
  });

  flushParagraph();
  return blocks;
}

export default function BlogContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="min-w-0 space-y-5 text-[15px] leading-7 text-foreground/85 sm:leading-8 md:text-base">
      {blocks.map((block, index) => {
        if (block.type === "heading2") {
          return (
            <h2 key={index} className="scroll-mt-28 pt-4 text-xl font-bold leading-tight text-foreground sm:text-2xl md:pt-5 md:text-3xl">
              {renderInline(block.lines[0])}
            </h2>
          );
        }

        if (block.type === "heading3") {
          return (
            <h3 key={index} className="scroll-mt-28 pt-3 text-lg font-bold leading-tight text-foreground sm:text-xl md:text-2xl">
              {renderInline(block.lines[0])}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={index} className="rounded-r-xl border-l-4 border-primary bg-primary/5 px-4 py-4 font-medium text-foreground sm:px-5">
              {renderInline(block.lines[0])}
            </blockquote>
          );
        }

        if (block.type === "unordered" || block.type === "ordered") {
          const List = block.type === "ordered" ? "ol" : "ul";
          return (
            <List key={index} className={`space-y-2 pl-6 ${block.type === "ordered" ? "list-decimal" : "list-disc"}`}>
              {block.lines.map((line, itemIndex) => (
                <li key={itemIndex} className="pl-1 marker:font-semibold marker:text-primary">
                  {renderInline(line)}
                </li>
              ))}
            </List>
          );
        }

        return <p key={index}>{renderInline(block.lines[0])}</p>;
      })}
    </div>
  );
}
