export type Tag = { id: number; name: string };

export type TaskEntry = {
  time_entries: [{ start: Date; seconds: number }];
  description: string;
  tag_ids: number[];
};
