import { ReactRouter } from '@decky/ui'

export const useParams = Object.values(ReactRouter).find((val) =>
  /return (\w)\?\1\.params:{}/.test(`${val}`)
) as <T>() => T
