import {
  afterPatch,
  ServerAPI,
  wrapReactType,
  findInReactTree,
  appDetailsClasses
} from 'decky-frontend-lib'
import { ReactElement } from 'react'
import ProtonMedal from '../components/protonMedal'
import { SettingsProvider } from '../context/settingsContext'

function patchLibraryApp(serverAPI: ServerAPI) {
  return serverAPI.routerHook.addPatch(
    '/library/app/:appid',
    (props?: { path?: string; children?: ReactElement }) => {
      if (!props?.children?.props?.renderFunc) {
        return props
      }

      afterPatch(
        props.children.props,
        'renderFunc',
        (_: Record<string, unknown>[], ret?: ReactElement) => {
          if (!ret?.props?.children?.type?.type) {
            return ret
          }

          wrapReactType(ret.props.children)
          afterPatch(
            ret.props.children.type,
            'type',
            (_2: Record<string, unknown>[], ret2?: ReactElement) => {
              const container = findInReactTree(
                ret2,
                (x: ReactElement) =>
                  Array.isArray(x?.props?.children) &&
                  x?.props?.className?.includes(
                    appDetailsClasses.InnerContainer
                  )
              )
              if (typeof container !== 'object') {
                return ret2
              }

              container.props.children.splice(
                1,
                0,
                <SettingsProvider>
                  <ProtonMedal serverAPI={serverAPI} />
                </SettingsProvider>
              )

              return ret2
            }
          )
          return ret
        }
      )
      return props
    }
  )
}

export default patchLibraryApp
