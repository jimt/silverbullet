import { IndexTreeEvent, QueryProviderEvent } from "$sb/app_event.ts";
import { renderToText } from "$sb/lib/tree.ts";
import {
  applyQuery,
  evalQueryExpression,
  liftAttributeFilter,
} from "$sb/lib/query.ts";
import { editor } from "$sb/syscalls.ts";
import { FileMeta } from "$sb/types.ts";
import { PromiseQueue } from "$sb/lib/async.ts";
import { ftsIndexPage, ftsSearch } from "./engine.ts";

const searchPrefix = "🔍 ";

// Search indexing is prone to concurrency issues, so we queue all write operations
const promiseQueue = new PromiseQueue();

export function indexPage({ name, tree }: IndexTreeEvent) {
  const text = renderToText(tree);
  return promiseQueue.runInQueue(async () => {
    // console.log("Now FTS indexing", name);
    // await engine.deleteDocument(name);
    await ftsIndexPage(name, text);
  });
}

export async function queryProvider({
  query,
}: QueryProviderEvent): Promise<any[]> {
  const phraseFilter = liftAttributeFilter(query.filter, "phrase");
  if (!phraseFilter) {
    throw Error("No 'phrase' filter specified, this is mandatory");
  }
  const phrase = evalQueryExpression(phraseFilter, {});
  // console.log("Phrase", phrase);
  let results: any[] = await ftsSearch(phrase);

  // Patch the object to a format that users expect (translate id to name)
  for (const r of results) {
    r.name = r.id;
    delete r.id;
  }

  results = applyQuery(query, results);
  return results;
}

export async function searchCommand() {
  const phrase = await editor.prompt("Search for: ");
  if (phrase) {
    await editor.navigate({ page: `${searchPrefix}${phrase}` });
  }
}

export async function readFileSearch(
  name: string,
): Promise<{ data: Uint8Array; meta: FileMeta }> {
  const phrase = name.substring(
    searchPrefix.length,
    name.length - ".md".length,
  );
  const results = await ftsSearch(phrase);
  const text = `# Search results for "${phrase}"\n${
    results
      .map((r) => `* [[${r.id}]] (score ${r.score})`)
      .join("\n")
  }
    `;

  return {
    data: new TextEncoder().encode(text),
    meta: {
      name,
      contentType: "text/markdown",
      size: text.length,
      created: 0,
      lastModified: 0,
      perm: "ro",
    },
  };
}

export function writeFileSearch(
  name: string,
): FileMeta {
  // Never actually writing this
  return getFileMetaSearch(name);
}

export function getFileMetaSearch(name: string): FileMeta {
  return {
    name,
    contentType: "text/markdown",
    size: -1,
    created: 0,
    lastModified: 0,
    perm: "ro",
  };
}
