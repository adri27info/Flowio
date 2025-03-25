import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class UserService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async loginUser(newData) {
    return await axios.post(`${this.apiBackend}/login/`, newData, {
      headers: this.headers,
    });
  }

  async registerUser(newData) {
    return await axios.post(`${this.apiBackend}/register/`, newData, {
      headers: this.headers,
    });
  }

  async resendCodeUser(newData) {
    return await axios.post(`${this.apiBackend}/resend-code/`, newData, {
      headers: this.headers,
    });
  }

  async activateCodeUser(newData) {
    return await axios.post(`${this.apiBackend}/activation-code/`, newData, {
      headers: this.headers,
    });
  }

  async refresh(refreshToken) {
    return await axios.post(
      `${this.apiBackend}/api/token/refresh/`,
      { refresh: refreshToken },
      {
        headers: this.headers,
      }
    );
  }

  async retrieveUser(id, token) {
    return await axios.get(`${this.apiBackend}/users/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUser(id, newData, token) {
    return await axios.put(`${this.apiBackend}/users/${id}/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteUser(id, token) {
    return await axios.delete(`${this.apiBackend}/users/${id}/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async logout(token, refreshToken) {
    return await axios.post(
      `${this.apiBackend}/api/blacklist-token/`,
      { refresh_token: refreshToken },
      {
        headers: {
          ...this.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new UserService();
