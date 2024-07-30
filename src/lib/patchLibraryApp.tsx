import {
  afterPatch,
  wrapReactType,
  findInReactTree,
  appDetailsClasses
} from '@decky/ui'
import { routerHook } from '@decky/api';
import React, { ReactElement } from 'react'
import ProtonMedal from '../components/protonMedal'

function patchLibraryApp() {
  return routerHook.addPatch(
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
                <ProtonMedal />
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
