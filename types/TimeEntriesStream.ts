export type TimelogEntry = {
  tags: string[];
  startDate: Date;
  description: string;
  duration: number;
};
export type TimeEntriesStream = AsyncGenerator<TimelogEntry>;
