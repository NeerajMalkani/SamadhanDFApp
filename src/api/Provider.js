import axios from "axios";

const BASE_URL = "http://43.204.210.148/api";

class Provider {
  getAll(resource) {
    return axios.get(`${BASE_URL}/${resource}`, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  get(resource, id) {
    return axios.get < `${BASE_URL}/${resource}/${id}`;
  }
  create(resource, params) {
    return axios.post(`${BASE_URL}/${resource}`, params, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  update(resource, params, id) {
    return axios.put(`${BASE_URL}/${resource}/${id}`, params);
  }
  delete(resource, id) {
    return axios.delete(`${BASE_URL}/${resource}/${id}`);
  }
  deleteAll(resource) {
    return axios.delete(`${BASE_URL}/${resource}`);
  }
}
export default new Provider();
