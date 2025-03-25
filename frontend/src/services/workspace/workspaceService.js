import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class WorkspaceService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async retrieveWorkspace(id, token) {
    return await axios.get(`${this.apiBackend}/workspaces/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWorkspaces(id, token) {
    return await axios.get(`${this.apiBackend}/workspaces/?user_id=${id}`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createWorkspace(token, newData) {
    return await axios.post(`${this.apiBackend}/workspaces/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateWorkspace(id, newData, token) {
    return await axios.put(`${this.apiBackend}/workspaces/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteWorkspace(id, token) {
    return await axios.delete(`${this.apiBackend}/workspaces/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getBackgroundWorkspaces(token) {
    return await axios.get(`${this.apiBackend}/background_workspaces/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new WorkspaceService();
