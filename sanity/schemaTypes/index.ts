import { type SchemaTypeDefinition } from "sanity";

import { startup } from "@/sanity/schemaTypes/startup";
import { author } from "@/sanity/schemaTypes/author";
import { playlist } from "@/sanity/schemaTypes/playlist";
import { comment } from "@/sanity/schemaTypes/comment";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist, comment],
};
