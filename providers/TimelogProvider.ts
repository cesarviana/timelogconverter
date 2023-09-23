import { TimeEntriesStream } from "../types/TimeEntriesStream";

export default interface TimelogProvider {
  getTimeEntries(startDate: Date): TimeEntriesStream;
}