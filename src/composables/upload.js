import UploadService from "@/server/UploadService";

const spaceImageUploader = (space, handlers) => {
  return UploadService.createSpaceImageUploader(space, handlers);
};

const projectFileUploader = (project, handlers) => {
  return UploadService.createProjectFileUploader(project, handlers);
};

export function useUpload() {
  return {
    spaceImageUploader,
    projectFileUploader
  };
}
