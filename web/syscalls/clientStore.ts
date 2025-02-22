import { SysCallMapping } from "../../plugos/system.ts";
import { DataStore } from "../../plugos/lib/datastore.ts";
import { KvKey } from "$sb/types.ts";

export function clientStoreSyscalls(
  ds: DataStore,
  prefix: KvKey = ["client"],
): SysCallMapping {
  return {
    "clientStore.get": (_ctx, key: string): Promise<any> => {
      return ds.get([...prefix, key]);
    },
    "clientStore.set": (_ctx, key: string, val: any): Promise<void> => {
      return ds.set([...prefix, key], val);
    },
    "clientStore.delete": (_ctx, key: string): Promise<void> => {
      return ds.delete([...prefix, key]);
    },
  };
}
