import ViewFile from "@/components/file/view_file";
import ViewRawFile from '@/components/file/view_raw_file';
import SharedFiles from "@/components/file/SharedFiles";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects/:projectId/file/:fileId",
    ...getDefaultComponents(ViewFile)
  },
  {
    path: "/shared-files",
    ...getDefaultComponents(SharedFiles)
  },
  {
    path: "/projects/:projectId/rawfile/:fileId",
    ...getDefaultComponents(ViewRawFile)
  }
];
