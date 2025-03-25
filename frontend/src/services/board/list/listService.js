import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class ListService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async createList(token, newData) {
    return await axios.post(`${this.apiBackend}/lists/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateList(id, newData, token) {
    return await axios.put(`${this.apiBackend}/lists/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteList(id, token) {
    return await axios.delete(`${this.apiBackend}/lists/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ListService();
