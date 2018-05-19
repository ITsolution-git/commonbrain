import ViewFile from "@/components/file/view_file";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects/:projectId/file/:fileId",
    ...getDefaultComponents(ViewFile)
  }
];
