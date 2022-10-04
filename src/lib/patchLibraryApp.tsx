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
                ret2.props.children?.[1]?.props.children.props.children[0]
              )
              afterPatch(
                ret2.props.children?.[1]?.props.children.props.children[0].type
                  .prototype,
                'render',
                (_3: Record<string, unknown>[], ret3: ReactElement) => {
                  const alreadySpliced = Boolean(
                    ret3.props.children[2].props.children.find(
                      (child: ReactElement) =>
                        child?.props?.className === 'protondb-decky-indicator'
                    )
                  )
                  if (!alreadySpliced) {
                    ret3.props.children[2].props.children.splice(
                      1,
                      0,
                      <SettingsProvider>
                        <ProtonMedal
                          serverAPI={serverAPI}
                          className="protondb-decky-indicator"
                        />
                      </SettingsProvider>
                    )
                  }
                  console.log(3, ret3.props.children[2].props.children)
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
