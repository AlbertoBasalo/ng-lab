export enum LogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}
export type LogEntry = {
  level: LogLevel;
  message: string;
  payload?: unknown;
  source?: string;
};
