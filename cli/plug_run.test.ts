import { AssetBundle } from "../plugos/asset_bundle/bundle.ts";
import { compileManifest } from "../plugos/compile.ts";
import { esbuild } from "../plugos/deps.ts";
import { runPlug } from "./plug_run.ts";
import assets from "../dist/plug_asset_bundle.json" assert { type: "json" };
import { assertEquals } from "../test_deps.ts";
import { path } from "../common/deps.ts";
import { MemoryKvPrimitives } from "../plugos/lib/memory_kv_primitives.ts";

Deno.test("Test plug run", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const assetBundle = new AssetBundle(assets);

  const testFolder = path.dirname(new URL(import.meta.url).pathname);
  const testSpaceFolder = path.join(testFolder, "test_space");

  const plugFolder = path.join(testSpaceFolder, "_plug");
  await Deno.mkdir(plugFolder, { recursive: true });

  await compileManifest(
    path.join(testFolder, "test.plug.yaml"),
    plugFolder,
  );
  assertEquals(
    await runPlug(
      testSpaceFolder,
      "test.run",
      [],
      assetBundle,
      new MemoryKvPrimitives(),
    ),
    "Hello",
  );

  // await Deno.remove(tempDir, { recursive: true });
  esbuild.stop();
});
