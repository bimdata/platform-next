import apiClient from "./api-client";
import { ERRORS, RuntimeError } from "./ErrorService";

class TagService {
  async fetchAllTags(project) {
    try {
      return await apiClient.collaborationApi.getTags(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_FETCH_ERROR, error);
    }
  }
}

const service = new TagService();

export default service;
