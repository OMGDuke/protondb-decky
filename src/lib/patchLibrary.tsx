import {
  afterPatch,
  findModuleChild,
  getReactInstance,
  ServerAPI,
  wrapReactClass,
  wrapReactType
} from 'decky-frontend-lib'
import { ReactElement } from 'react'
import { ProtonDBCacheProvider } from '../context/protobDbCacheContext'

function patchLibrary(serverAPI: ServerAPI) {
  return serverAPI.routerHook.addPatch(
    '/library/tab/Installed',
    (props: { path: string; children: ReactElement }) => {
      console.log('hello')
      console.log('children', props.children)
      return props
    }
  )
}

export default patchLibrary
