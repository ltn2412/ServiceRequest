import path from "path"
import { createLogger, format, transports } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

const { combine, timestamp, printf, colorize } = format

const logFormat = printf(({ level, message, timestamp, requestId }) => `[${timestamp}] ${level.toUpperCase()} [RequestId:${requestId}]: ${message}`)

const logErrorFormat = printf(({ level, message, timestamp, requestId }) => `[${timestamp}] ${level.toUpperCase()} [RequestId:${requestId}]: ${message}`)

const logSocketFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)

const logInfo = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new DailyRotateFile({
      filename: path.join("logs", "%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "7d",
    }),
  ],
})

const logError = createLogger({
  level: "error",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logErrorFormat),
  transports: [
    new DailyRotateFile({
      filename: path.join("logs", "errors/%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
})

const logUnknownError = createLogger({
  level: "error",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logErrorFormat),
  transports: [
    new DailyRotateFile({
      filename: path.join("logs", "unknownErrors/%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
})

const logSocket = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logSocketFormat),
  transports: [
    new DailyRotateFile({
      filename: path.join("logs", "socket/%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
})

const appLoggerInfo = (meta: { requestId: string }, message: string) => logInfo.info(message, { requestId: meta.requestId })

const appLoggerError = (meta: { requestId: string }, message: string, errorMessage?: string) =>
  logError.error(`${message} ${errorMessage ? `\n${errorMessage}` : ""}`, { requestId: meta.requestId })

const appUnknownLoggerError = (meta: { requestId: string }, message: string, stack?: string) =>
  logUnknownError.error(`${message}${stack ? `\n----- STACK TRACE -----\n${stack}` : ""}`, { requestId: meta.requestId })

const appLoggerSocket = (message: string) => logSocket.info(message)

if (process.env.NODE_ENV !== "production") {
  const colorizedFormat = combine(
    colorize({ all: true }),

    printf(({ level, message, timestamp, requestId }) => {
      const rid = requestId ? ` [RequestId:${requestId}]` : ""
      const upperLevel = level.toUpperCase()
      return `[${timestamp}] ${upperLevel}${rid}: ${message}`
    })
  )

  logInfo.add(new transports.Console({ format: colorizedFormat }))
  logError.add(new transports.Console({ format: colorizedFormat, stderrLevels: ["error"] }))
  logUnknownError.add(new transports.Console({ format: colorizedFormat, stderrLevels: ["error"] }))
  logSocket.add(new transports.Console({ format: colorizedFormat }))
}

export { appLoggerError, appLoggerInfo, appLoggerSocket, appUnknownLoggerError }
