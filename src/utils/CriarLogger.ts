import { createLogger, format, transports } from 'winston'

const log = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  const devFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} - ${level}: ${message}`
  })

  log.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      devFormat
    )
  }))
}

export { log }
