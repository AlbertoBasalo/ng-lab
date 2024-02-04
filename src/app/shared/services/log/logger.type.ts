export enum LogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}

/**
 * An event raised during the application lifecycle.
 * @property level: The severity of the event.
 * @property message: The message explaining the event.
 * @property payload: Additional data.
 * @property source: The source (function, module...) of the event.
 * @property userId: The user ID associated with the event.
 * @property timestamp: The time the event occurred.
 */
export type AppEvent = {
  level: LogLevel;
  message: string;
  payload?: unknown;
  source?: string;
  userId?: string;
  timestamp: Date;
};

const appEvents: AppEvent[] = [];

/**
 * Quantify the application events.
 * @property name: The name of the metric (Ex. page visits).
 * @property target: The target of the metric (Ex. /home).
 * @property unit: The unit of the metric (Ex. visits).
 * @property amount: The amount of the metric (Ex. 1).
 * @property timestamp: The time the metric was measured.
 */
type Metric = {
  name: string;
  target: string;
  unit: string;
  amount: number;
  timestamp: Date;
};
