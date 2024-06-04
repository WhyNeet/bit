import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("./src/runtime/esm.loader.js", pathToFileURL("./"));
