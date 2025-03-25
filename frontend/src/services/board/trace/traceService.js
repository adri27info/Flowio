import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class TraceService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async createTrace(token, newData) {
    return await axios.post(`${this.apiBackend}/traces/`, newData, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new TraceService();
