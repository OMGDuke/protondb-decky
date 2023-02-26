import {
  afterPatch,
  findModuleChild,
  getReactInstance,
  ServerAPI,
  wrapReactClass,
  wrapReactType
} from 'decky-frontend-lib'
import { ReactElement } from 'react'

function patchHome(serverAPI: ServerAPI) {
  return serverAPI.routerHook.addPatch(
    '/library/home',
    (props: { path: string; children: ReactElement }) => {
      console.log('Library Route:', props)
      afterPatch(
        props.children,
        'type',
        (_: Record<string, unknown>[], ret: ReactElement) => {
          console.log({ ret })
          wrapReactType(ret)
          afterPatch(
            ret.type,
            'type',
            (_2: Record<string, unknown>[], ret2: ReactElement) => {
              console.log({ ret2 })
              wrapReactType(
                ret2.props.children.props.children.props.children.props
                  .children[0].props.children.props.children
              )
              afterPatch(
                ret2.props.children.props.children.props.children.props
                  .children[0].props.children.props.children.type,
                'type',
                (_3: Record<string, unknown>[], ret3: ReactElement) => {
                  console.log({ ret3 })
                  console.log(
                    'RECENT GAME IDS',
                    ret3.props.children[1].props.children[1].props.games
                  )
                  wrapReactType(ret3.props.children[1].props.children[1].type)
                  afterPatch(
                    ret3.props.children[1].props.children[1],
                    'type',
                    (_4: Record<string, unknown>[], ret4: ReactElement) => {
                      console.log({ ret4 })
                      wrapReactType(ret4)
                      afterPatch(
                        ret4,
                        'type',
                        (_5: Record<string, unknown>[], ret5: ReactElement) => {
                          console.log({ ret5 })
                          return ret5
                        }
                      )
                      return ret4
                    }
                  )
                  return ret3
                }
              )
              // wrapReactClass(
              //   ret2.props.children.props.children.props.children.props
              //     .children[0].props.children
              // )
              // wrapReactType(
              //   ret2.props.children.props.children.props.children.props
              //     .children[0]
              // )
              // // afterPatch(
              //   ret2.props.children.props.children.props.children.props
              //     .children[0].props.children.props.children.type,
              //   'type',
              //   (_3: Record<string, unknown>[], ret3: ReactElement) => {
              //     // console.log('ret3', ret3.props.children[1].props.children[1])
              //     // // wrapReactType(ret3.props.children[1].props.children[1])
              //     // afterPatch(
              //     //   ret3.props.children[1].props.children[1].type,
              //     //   'type',
              //     //   (_4: Record<string, unknown>[], ret4: ReactElement) => {
              //     //     console.log('ret4', ret4)
              //     //     return ret4
              //     //   }
              //     // )
              //     return ret3
              //   }
              // )
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

export default patchHome
