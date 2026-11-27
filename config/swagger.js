import { readFileSync } from "node:fs";
import YAML from "yaml";

const yamlContent = readFileSync(
  new URL("../openapi.yaml", import.meta.url),
  "utf8",
);

export const swaggerDocument = YAML.parse(yamlContent);