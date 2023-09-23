import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import Toggl from "../providers/Toggl";
import dayjs from "dayjs";
chai.use(chaiAsPromised);
const { expect } = chai;

describe("test conversion", () => {
  it("gets weekly report", async () => {
    const toggl = Toggl.instance();
    const startDate = dayjs().subtract(1, "week").toDate();
    const result = await toggl.getEntries(startDate);
    expect(result).to.not.be.null;
  });
});
