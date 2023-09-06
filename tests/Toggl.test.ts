import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import Toggl from "../providers/Toggl";
chai.use(chaiAsPromised);
const { expect } = chai;

describe("test conversion", () => {

  it('gets weekly report', async () => {
    const toggl = Toggl.instance();
    const result = await toggl.getWeekEntries();
    expect(result).to.not.be.null;
  });
  
});