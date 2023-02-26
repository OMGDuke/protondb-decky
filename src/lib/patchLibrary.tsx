import {
  afterPatch,
  ServerAPI,
  wrapReactClass,
  wrapReactType
} from 'decky-frontend-lib'
import { JSXElementConstructor, ReactElement } from 'react'

import LibraryTierMarker from '../components/libraryTierMarker'

type ReactElemType = string | JSXElementConstructor<HTMLElement>

type AppCache = Map<string, ReactElemType>

type CollectionCache = {
  level1: ReactElemType | undefined
  level2: ReactElemType | undefined
  level3: ReactElemType | undefined
  gamePatches: Map<string, AppCache>
}

function patchLibrary(serverAPI: ServerAPI) {
  let collectionsPatchTracker = new Map<string, CollectionCache>()
  const routePathLib = '/library'
  return serverAPI.routerHook.addPatch(
    routePathLib,
    (routeProps: { path: string; children: ReactElement }) => {
      collectionsPatchTracker = new Map<string, CollectionCache>()

      afterPatch(
        routeProps.children,
        'type',
        (_: Record<string, unknown>[], ret: ReactElement) => {
          let cache: ReactElemType | null = null
          let cache2: {
            [collectionId: string]: ReactElement['type']
          } = {}

          afterPatch(
            ret,
            'type',
            (_: Record<string, unknown>[], ret2: ReactElement) => {
              if (!cache) {
                wrapReactType(ret2)
                afterPatch(
                  ret2.type,
                  'type',
                  (_: Record<string, unknown>[], ret3: ReactElement) => {
                    cache = ret2.type

                    const cTab =
                      ret3.props.children?.props.children[1].props.activeTab
                    const tabs = ret3.props.children?.props.children[1].props
                      .tabs as SteamTab[]

                    const tab = tabs?.find(
                      (tab: SteamTab) => tab.id == cTab
                    ) as SteamTab
                    const collection = tab.content.props
                      .collection as SteamCollection
                    let collectionId = collection?.id

                    if (collectionId) {
                      if (!cache2[collectionId]) {
                        if (collectionId != 'deck-desktop-apps') {
                          if (!collectionsPatchTracker.has(collectionId)) {
                            collectionsPatchTracker.set(collectionId, {
                              level1: undefined,
                              level2: undefined,
                              level3: undefined,
                              gamePatches: new Map<string, AppCache>()
                            })
                          }

                          afterPatch(
                            tab.content,
                            'type',
                            (
                              _: Record<string, unknown>[],
                              ret4: ReactElement
                            ) => {
                              cache2 = tab.content.type
                              const tarElem = ret4.props
                                .children[1] as ReactElement
                              if (
                                !collectionsPatchTracker.get(collectionId)
                                  ?.level1
                              ) {
                                const appOverviews = tarElem.props
                                  .appOverviews as SteamAppOverview[]

                                for (const appOverview of appOverviews) {
                                  collectionsPatchTracker
                                    .get(collectionId)
                                    ?.gamePatches.set(
                                      appOverview.display_name,
                                      new Map<string, ReactElemType>()
                                    )
                                }
                                console.log(collectionsPatchTracker)

                                patchCollection(tarElem, collectionId)
                              } else {
                                tarElem.type = collectionsPatchTracker.get(
                                  collectionId
                                )?.level1 as unknown as ReactElemType
                              }

                              return ret4
                            }
                          )
                        }
                      } else {
                        tab.content.type = cache2
                      }
                    } else if (tab.content.props.collectionid) {
                      collectionId = tab.content.props.collectionid

                      if (!cache2[collectionId]) {
                        if (!collectionsPatchTracker.has(collectionId)) {
                          collectionsPatchTracker.set(collectionId, {
                            level1: undefined,
                            level2: undefined,
                            level3: undefined,
                            gamePatches: new Map<string, AppCache>()
                          })
                        }

                        afterPatch(
                          tab.content,
                          'type',
                          (
                            _: Record<string, unknown>[],
                            ret4: ReactElement
                          ) => {
                            cache2[collectionId] = tab.content.type
                            const tarElem2 = ret4.props
                              .children[0] as ReactElemType

                            afterPatch(
                              tarElem2,
                              'type',
                              (
                                _: Record<string, unknown>[],
                                ret5: ReactElement
                              ) => {
                                const tarElem3 = ret5.props
                                  .children[1] as ReactElement

                                afterPatch(
                                  tarElem3,
                                  'type',
                                  (
                                    _: Record<string, unknown>[],
                                    ret6: ReactElement
                                  ) => {
                                    const tarElem4 = ret6.props
                                      .children[1] as ReactElement
                                    if (
                                      !collectionsPatchTracker.get(collectionId)
                                        ?.level1
                                    ) {
                                      const appOverviews = tarElem4.props
                                        .appOverviews as SteamAppOverview[]

                                      for (const appOverview of appOverviews) {
                                        collectionsPatchTracker
                                          .get(collectionId)
                                          ?.gamePatches.set(
                                            appOverview.display_name,
                                            new Map<string, ReactElemType>()
                                          )
                                      }

                                      patchCollection(tarElem4, collectionId)
                                    } else {
                                      tarElem4.type =
                                        collectionsPatchTracker.get(
                                          collectionId
                                        )?.level1 as unknown as ReactElemType
                                    }

                                    return ret6
                                  }
                                )

                                return ret5
                              }
                            )

                            return ret4
                          }
                        )
                      } else {
                        tab.content.type = cache2
                      }
                    }

                    return ret3
                  }
                )
              } else {
                ret2.type = cache
              }

              return ret2
            }
          )

          return ret
        }
      )

      return routeProps
    }
  )

  function patchCollection(tarElem: ReactElement, collectionId: string) {
    afterPatch(
      tarElem,
      'type',
      (_: Record<string, unknown>[], ret5: ReactElement) => {
        const collection = collectionsPatchTracker.get(
          collectionId
        ) as CollectionCache
        if (collection?.level1) {
          collection.level1 = tarElem.type
        }
        const tarElem2 = ret5.props.children[1] as unknown as ReactElement

        if (!collection?.level2) {
          const collectionCache: ReactElemType | null = null

          afterPatch(
            tarElem2,
            'type',
            (_: Record<string, unknown>[], ret6: ReactElement) => {
              if (collection) {
                collection.level2 = tarElem2.type
              }
              const tarElem3 = ret6.props.children[0].props
                .children[0] as ReactElement

              if (!collectionCache) {
                wrapReactClass(tarElem3) //! investigate this. may be causing issues
                afterPatch(
                  (tarElem3.type as React.JSXElementConstructor<HTMLElement>)
                    .prototype,
                  'render',
                  (_: Record<string, unknown>[], ret7: ReactElement) => {
                    // collectionCache = tarElem3.type
                    const gameElemList = ret7.props.children[1].props
                      .childElements as ReactElement[]

                    for (const gameElem of gameElemList) {
                      const app: SteamAppOverview =
                        gameElem.props.children.props.app

                      if (
                        app.store_category.length > 0 ||
                        app.store_tag.length > 0
                      ) {
                        patchGamePortrait(gameElem, app, collectionId)
                      }
                    }

                    return ret7
                  }
                )
              } else {
                tarElem3.type = collectionCache
              }

              return ret6
            }
          )
        } else {
          tarElem2.type = collectionsPatchTracker.get(collectionId)
            ?.level2 as ReactElemType
        }

        return ret5
      }
    )
  }

  async function patchGamePortrait(
    gameElem: ReactElement,
    app: SteamAppOverview,
    collectionId: string
  ) {
    const tarGameElem = gameElem.props.children
    if (
      !collectionsPatchTracker
        .get(collectionId)
        ?.gamePatches.get(app.display_name)
        ?.has('level2')
    ) {
      wrapReactType(tarGameElem)
      afterPatch(
        tarGameElem.type,
        'type',
        (_: Record<string, unknown>[], ret8: ReactElement) => {
          collectionsPatchTracker
            .get(collectionId)
            ?.gamePatches.get(app.display_name)
            ?.set('level2', tarGameElem.type)

          const tarGameElem2 =
            ret8.props.children.props.children[0].props.children.props
              .children[5]

          afterPatch(
            tarGameElem2,
            'type',
            (_: Record<string, unknown>[], ret9: ReactElement) => {
              const existIdx = (
                ret9.props.children as ReactElement[]
              ).findIndex(
                (child: ReactElement) =>
                  child.props.className == 'protondb-decky-indicator-library'
              )

              if (existIdx == -1) {
                ret9.props.children.push(
                  <LibraryTierMarker appId={app.appid} />
                )
              }

              return ret9
            }
          )

          return ret8
        }
      )
    } else {
      tarGameElem.type = collectionsPatchTracker
        .get(collectionId)
        ?.gamePatches.get(app.display_name)
        ?.get('level2')
    }
  }
}

export default patchLibrary
