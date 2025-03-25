import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class CardService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async createCard(token, newData) {
    return await axios.post(`${this.apiBackend}/cards/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async retrieveCard(id, token) {
    return await axios.get(`${this.apiBackend}/cards/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateCard(id, newData, token) {
    return await axios.put(`${this.apiBackend}/cards/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async partialUpdateCard(id, newData, token) {
    return await axios.patch(`${this.apiBackend}/cards/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async batchCard(updates, token) {
    return await axios.post(
      `${this.apiBackend}/cards/batch-update/`,
      { updates },
      {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async deleteCard(id, token) {
    return await axios.delete(`${this.apiBackend}/cards/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new CardService();
