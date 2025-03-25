import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class BoardService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async retrieveBoard(id, token) {
    return await axios.get(`${this.apiBackend}/boards/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createBoard(token, newData) {
    return await axios.post(`${this.apiBackend}/boards/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateBoard(id, newData, token) {
    return await axios.put(`${this.apiBackend}/boards/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteBoard(id, token) {
    return await axios.delete(`${this.apiBackend}/boards/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new BoardService();
