import axios, { AxiosInstance } from "axios";

import dayjs from "dayjs";
import { Tag, TaskEntry } from "../types/Toggl";

export default class Toggl {
  workspaceId: number;
  userId: number;
  axiosInstance: AxiosInstance;
  static instance(): Toggl {
    return new Toggl();
  }
  constructor() {
    this.workspaceId = parseInt(process.env.TOGGL_WORKSPACE_ID ?? "", 10);
    this.userId = parseInt(process.env.TOGGL_USER_ID ?? "", 10);
    const apiToken = btoa(`${process.env.TOGGL_API_KEY}:api_token`);
    this.axiosInstance = axios.create({
      baseURL: "https://api.track.toggl.com/",
      headers: {
        Authorization: `Basic ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getWeekEntries(): Promise<TaskEntry[]> {
    const end_date = dayjs().endOf("week").format("YYYY-MM-DD");
    const start_date = dayjs().startOf("week").format("YYYY-MM-DD");
    const response = await this.axiosInstance.post(
      `reports/api/v3/workspace/${this.workspaceId}/search/time_entries`,
      {
        // client_ids: ["integer"],
        start_date,
        end_date,
        user_ids: [this.userId],
      }
    );
    return response.data;
  }

  async getTags(): Promise<Tag[]> {
    const response = await this.axiosInstance.get(
      `/api/v9/workspaces/${this.workspaceId}/tags`
    );
    return response.data;
  }
}
