import { LogEntry, LogLevel } from '@shared/services/logger.service';

export class LabLogWriter {
  write(entry: LogEntry) {
    const entryMessage = `${entry.message} @ ${entry.source}`;
    switch (entry.level) {
      case LogLevel.debug:
        console.log('🔍 ' + entryMessage, entry.payload);
        break;
      case LogLevel.info:
        console.log('📘 ' + entryMessage, entry.payload);
        break;
      case LogLevel.warn:
        console.log('☣️ ' + entryMessage, entry.payload);
        break;
      case LogLevel.error:
        console.log('🔥 ' + entryMessage, entry.payload);
        break;
    }
  }
}
