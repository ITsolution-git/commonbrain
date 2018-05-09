import ViewFile from "@/components/file/view_file";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects/:id/file/:id",
    ...getDefaultComponents(ViewFile)
  }
];
