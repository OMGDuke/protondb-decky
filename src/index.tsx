import {
  afterPatch,
  definePlugin,
  ServerAPI,
  staticClasses
} from 'decky-frontend-lib'
import { ReactElement } from 'react'
import { SiProtondb } from 'react-icons/si'

import ProtonMedal from './components/protonMedal'

export default definePlugin((serverAPI: ServerAPI) => {
  const patch = serverAPI.routerHook.addPatch(
    '/library/app/:appid',
    (props: { path: string; children: ReactElement }) => {
      afterPatch(
        props.children.props,
        'renderFunc',
        (_: Record<string, unknown>[], ret: ReactElement) => {
          console.log('ret', ret)
          console.log('typeof', typeof ret)
          afterPatch(
            ret.props.children.type,
            'type',
            (_2: Record<string, unknown>[], ret2: ReactElement) => {
              const alreadySpliced = Boolean(
                ret2.props.children[1].props.children.props.children.find(
                  (child: ReactElement) =>
                    child?.props?.className === 'protondb-decky-indicator'
                )
              )
              if (!alreadySpliced) {
                ret2.props.children[1].props.children.props.children.splice(
                  1,
                  0,
                  <ProtonMedal
                    serverAPI={serverAPI}
                    className="protondb-decky-indicator"
                  />
                )
              }
              return ret2
            }
          )
          return ret
        }
      )
      return props
    }
  )

  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <SiProtondb />,
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', patch)
    }
  }
})
