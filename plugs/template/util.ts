import { handlebarHelpers } from "../../common/syscalls/handlebar_helpers.ts";
import { PageMeta } from "$sb/types.ts";
import { handlebars, space } from "$sb/syscalls.ts";
import { cleanTemplate } from "./plug_api.ts";

export function buildHandebarOptions(pageMeta: PageMeta) {
  return {
    helpers: handlebarHelpers(),
    data: { page: pageMeta },
  };
}

export function defaultJsonTransformer(v: any): string {
  if (v === undefined) {
    return "";
  }
  if (typeof v === "string") {
    return v.replaceAll("\n", " ").replaceAll("|", "\\|");
  }
  if (Array.isArray(v)) {
    return v.map(defaultJsonTransformer).join(", ");
  } else if (v && typeof v === "object") {
    return Object.entries(v).map(([k, v]: [string, any]) =>
      `${k}: ${defaultJsonTransformer(v)}`
    ).join(", ");
  }
  return "" + v;
}

// Nicely format an array of JSON objects as a Markdown table
export function jsonToMDTable(
  jsonArray: any[],
  valueTransformer: (v: any) => string = defaultJsonTransformer,
): string {
  const headers = new Set<string>();
  for (const entry of jsonArray) {
    for (const k of Object.keys(entry)) {
      headers.add(k);
    }
  }

  const headerList = [...headers];
  const lines = [];
  lines.push(
    "|" +
      headerList
        .map(
          (headerName) => headerName,
        )
        .join("|") +
      "|",
  );
  lines.push(
    "|" +
      headerList
        .map(() => "--")
        .join("|") +
      "|",
  );
  for (const val of jsonArray) {
    const el = [];
    for (const prop of headerList) {
      const s = valueTransformer(val[prop]);
      el.push(s);
    }
    lines.push("|" + el.join("|") + "|");
  }
  return lines.join("\n");
}

export async function renderQueryTemplate(
  pageMeta: PageMeta,
  templatePage: string,
  data: any[],
  renderAll: boolean,
): Promise<string> {
  let templateText = await space.readPage(templatePage);
  templateText = await cleanTemplate(templateText);

  if (!renderAll) {
    templateText = `{{#each .}}\n${templateText}\n{{/each}}`;
  }
  return handlebars.renderTemplate(templateText, data, { page: pageMeta });
}
