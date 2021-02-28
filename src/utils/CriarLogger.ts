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
  transports: []
})

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
} else {
  log.add(new transports.Console())
}

export { log }
