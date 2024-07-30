import {
  afterPatch,
  findInReactTree,
  appDetailsClasses,
  createReactTreePatcher
} from '@decky/ui'
import { routerHook } from '@decky/api';
import React, { ReactElement } from 'react'
import ProtonMedal from '../components/protonMedal'

function patchLibraryApp() {
  return routerHook.addPatch(
    '/library/app/:appid',
    (tree: any) => {
      const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc);
      if (routeProps) {
        const patchHandler = createReactTreePatcher([
          (tree: any) => findInReactTree(tree, (x: any) => x?.props?.children?.props?.overview)?.props?.children
        ], (_: Array<Record<string, unknown>>, ret?: ReactElement) => {
          const container = findInReactTree(
            ret,
            (x: ReactElement) =>
              Array.isArray(x?.props?.children) &&
              x?.props?.className?.includes(
                appDetailsClasses.InnerContainer
              )
          )
          if (typeof container !== 'object') {
            return ret
          }

          container.props.children.splice(
            1,
            0,
            <ProtonMedal />
          )

          return ret
        });

        afterPatch(routeProps, "renderFunc", patchHandler);
      }

      return tree;
    }
  )
}

export default patchLibraryApp
