import apiClient from "./api-client.js";

class BcfService {
  async fetchProjectTopics(project) {
    try {
      return await apiClient.bcfApi.getTopics({
        projectsPk: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async fetchTopicViewpoints(project, topic, imgFormat = null) {
    try {
      return await apiClient.bcfApi.getTopicViewpoints({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        imgFormat: imgFormat ? "url" : null
      });
    } catch (error) {
      console.log(error);
    }
  }
  async updateProjectTopics(project, bcfTopic, topic) {
    try {
      return await apiClient.bcfApi.fullUpdateTopic({
        projectsPk: project.id,
        guid: bcfTopic.guid,
        data: topic
      });
    } catch (error) {
      console.log(error);
    }
  }
  async fetchExtensions(project) {
    try {
      return await apiClient.bcfApi.getExtensions({
        id: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async fetchDetailedExtensions(project) {
    try {
      return await apiClient.bcfApi.getDetailedExtensions({
        id: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createExtension(project, extensionType, data) {
    try {
      return await apiClient.bcfApi["createExtension" + extensionType]({
        projectsPk: project.id,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteExtension(project, extensionType, priority) {
    try {
      return await apiClient.bcfApi["deleteExtension" + extensionType]({
        projectsPk: project.id,
        id: priority.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async updateExtension(project, extensionType, extensionId, data) {
    try {
      return await apiClient.bcfApi["updateExtension" + extensionType]({
        projectsPk: project.id,
        id: extensionId,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createTopic(project, topic) {
    try {
      return await apiClient.bcfApi.createTopic({
        projectsPk: project.id,
        data: topic
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteTopic(project, topic) {
    try {
      return await apiClient.bcfApi.deleteTopic({
        projectsPk: project.id,
        guid: topic.guid
      });
    } catch (error) {
      console.log(error);
    }
  }
  async importBcf(project, file) {
    try {
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);
      await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/import`,
        {
          method: "POST",
          headers: {
            authorization: apiClient.config.accessToken()
          },
          body: formData
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async exportBcf(project) {
    try {
      return await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/export`,
        {
          method: "GET",
          headers: {
            authorization: apiClient.config.accessToken()
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new BcfService();

export default service;
