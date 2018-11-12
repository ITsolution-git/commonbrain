import Templates from "@/components/templates/templates";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/templates",
    ...getDefaultComponents(Templates)
  }
];
