import { AppEvent, LogLevel } from '@shared/services/log/logger.type';

export class LabLogWriter {
  write(entry: AppEvent) {
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
