import axios from "axios";
import { useEnvironment } from "@/composables/useEnvironment";

class StructureService {
  constructor() {
    this.apiBackend = useEnvironment().apiBackend;
    this.headers = {
      Accept: "application/json",
    };
  }

  async getStructures(token) {
    return await axios.get(`${this.apiBackend}/structures/`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new StructureService();
