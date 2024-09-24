// const { create } = require("axios");
import axios from "axios";

export class ClickUp {
  constructor(
    token,
    { baseURL = "https://api.clickup.com/api/v2", debug = false } = {}
  ) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (debug) {
      this.client.interceptors.request.use((request) => {
        console.log("request", request);
        return request;
      });
    }
  }

  async me() {
    const {
      data: { user },
    } = await this.client.get("/user");
    return user;
  }

  async newTask(listId, task) {
    try {
      const { data } = await this.client.post(`/list/${listId}/task`, {
        ...task,
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}
