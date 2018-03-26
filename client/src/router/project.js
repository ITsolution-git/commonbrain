import Projects from "@/components/projects/projects";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects",
    ...getDefaultComponents(Projects)
  }
];
