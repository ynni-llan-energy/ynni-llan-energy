import { type SchemaTypeDefinition } from "sanity";

import { newsPost } from "./news-post";
import { project } from "./project";
import { siteSettings } from "./site-settings";
import { person } from "./person";
import { volunteerRole } from "./volunteer-role";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [newsPost, project, siteSettings, person, volunteerRole],
};
