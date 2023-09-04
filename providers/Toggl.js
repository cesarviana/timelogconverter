const axios = require("axios");
const dayjs = require("dayjs");
class Toggl {
  /**
   *
   * @returns {Toggl}
   */
  static instance() {
    return new Toggl();
  }
  constructor() {
    this.workspaceId = parseInt(process.env.TOGGL_WORKSPACE_ID, 10);
    this.userId = parseInt(process.env.TOGGL_USER_ID, 10);
    const apiToken = btoa(`${process.env.TOGGL_API_KEY}:api_token`);
    this.axiosInstance = axios.create({
      baseURL: "https://api.track.toggl.com/",
      headers: {
        Authorization: `Basic ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
  }
  
  async getWeekEntries() {
    const end_date = dayjs().endOf("week").format("YYYY-MM-DD");
    const start_date = dayjs().startOf("week").format("YYYY-MM-DD");
    try {
      return await this.axiosInstance.post(
        `reports/api/v3/workspace/${this.workspaceId}/search/time_entries`,
        {
          // client_ids: ["integer"],
          start_date,
          end_date,
          user_ids: [this.userId],
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Toggl;
