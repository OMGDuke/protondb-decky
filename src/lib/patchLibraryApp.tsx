import {
  afterPatch,
  ServerAPI,
  wrapReactClass,
  wrapReactType
} from 'decky-frontend-lib'
import { ReactElement } from 'react'
import ProtonMedal from '../components/protonMedal'
import { SettingsProvider } from '../context/settingsContext'

function patchLibraryApp(serverAPI: ServerAPI) {
  return serverAPI.routerHook.addPatch(
    '/library/app/:appid',
    (props: { path: string; children: ReactElement }) => {
      afterPatch(
        props.children.props,
        'renderFunc',
        (_: Record<string, unknown>[], ret: ReactElement) => {
          wrapReactType(ret.props.children)
          afterPatch(
            ret.props.children.type,
            'type',
            (_2: Record<string, unknown>[], ret2: ReactElement) => {
              wrapReactClass(
                ret2.props?.children?.[1]?.props.children.props.children[0]
              )
              afterPatch(
                ret2.props?.children?.[1]?.props.children.props.children[0].type
                  .prototype,
                'render',
                (_3: Record<string, unknown>[], ret3: ReactElement) => {
                  wrapReactClass(ret3.props.children[2])
                  afterPatch(
                    ret3.props.children[2].type.prototype,
                    'render',
                    (_4: Record<string, unknown>[], ret4: ReactElement) => {
                      const alreadySpliced = Boolean(
                        ret4.props.children.props.children.find(
                          (child: ReactElement) =>
                            child?.props?.className ===
                            'protondb-decky-indicator'
                        )
                      )
                      if (!alreadySpliced) {
                        ret4.props.children.props.children = (
                          <>
                            {...ret4.props.children.props.children}
                            <SettingsProvider>
                              <ProtonMedal
                                serverAPI={serverAPI}
                                className="protondb-decky-indicator"
                              />
                            </SettingsProvider>
                          </>
                        )
                      }
                      return ret4
                    }
                  )
                  return ret3
                }
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
