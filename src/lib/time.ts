export function isOutdated(lastUpdated: string) {
  const now = new Date()
  const msBetweenDates = Math.abs(
    new Date(lastUpdated).getTime() - now.getTime()
  )

  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000)
  return hoursBetweenDates > 24
}
