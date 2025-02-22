import { SysCallMapping } from "../../plugos/system.ts";
import { parse } from "../markdown_parser/parse_tree.ts";
import type { ParseTree } from "$sb/lib/tree.ts";
import { extendedMarkdownLanguage } from "../markdown_parser/parser.ts";

export function markdownSyscalls(): SysCallMapping {
  return {
    "markdown.parseMarkdown": (_ctx, text: string): ParseTree => {
      return parse(extendedMarkdownLanguage, text);
    },
  };
}
