// https://github.com/hulkrelax/deckfaqs/blob/0dbc26ebd19f4b6e1bc06e5b4c940b1ba77fed22/src/SteamClient.d.ts

// Non-exhaustive definition of the SteamClient that is available in the SP tab
// This object has a lot more properties/methods than are listed here
declare namespace SteamClient {
  const Apps: {
    GetAllShortcuts(): Promise<Shortcut[]>
    RegisterForGameActionStart(
      callback: (
        actionType: number,
        strAppId: string,
        actionName: string
      ) => unknown
    ): RegisteredEvent
  }
  const InstallFolder: {
    GetInstallFolders(): Promise<InstallFolder[]>
  }
  const GameSessions: {
    RegisterForAppLifetimeNotifications(
      callback: (appState: AppState) => unknown
    ): RegisteredEvent
  }
  const BrowserView: {
    Create(): unknown
    CreatePopup(): unknown
    Destroy(e: unknown): void
  }

  const Storage: {
    GetJSON(key: string): Promise<string>
    SetObject(key: string, value: Record<string, unknown>): Promise<void>
    DeleteKey(key: string): Promise<void>
  }
}

declare const enum DisplayStatus {
  Invalid = 0,
  Launching = 1,
  Uninstalling = 2,
  Installing = 3,
  Running = 4,
  Validating = 5,
  Updating = 6,
  Downloading = 7,
  Synchronizing = 8,
  ReadyToInstall = 9,
  ReadyToPreload = 10,
  ReadyToLaunch = 11,
  RegionRestricted = 12,
  PresaleOnly = 13,
  InvalidPlatform = 14,
  PreloadComplete = 16,
  BorrowerLocked = 17,
  UpdatePaused = 18,
  UpdateQueued = 19,
  UpdateRequired = 20,
  UpdateDisabled = 21,
  DownloadPaused = 22,
  DownloadQueued = 23,
  DownloadRequired = 24,
  DownloadDisabled = 25,
  LicensePending = 26,
  LicenseExpired = 27,
  AvailForFree = 28,
  AvailToBorrow = 29,
  AvailGuestPass = 30,
  Purchase = 31,
  Unavailable = 32,
  NotLaunchable = 33,
  CloudError = 34,
  CloudOutOfDate = 35,
  Terminating = 36
}

type AppState = {
  unAppID: number
  nInstanceID: number
  bRunning: boolean
}

declare namespace appStore {
  function GetAppOverviewByGameID(appId: number): AppOverview
}

type RegisteredEvent = {
  unregister(): void
}

type Shortcut = {
  appid: number
  data: {
    bIsApplication: true
    strAppName: string
    strSortAs: string
    strExePath: string
    strShortcutPath: string
    strArguments: string
    strIconPath: string
  }
}

type AppOverview = {
  app_type: number
  appid: string
  display_name: string
  display_status: DisplayStatus
  sort_as: string
}

type App = {
  nAppID: number
  strAppName: string
  strSortAs: string
  rtLastPlayed: number
  strUsedSize: string
  strDLCSize: string
  strWorkshopSize: string
  strStagedSize: string
}

type InstallFolder = {
  nFolderIndex: number
  strFolderPath: string
  strUserLabel: string
  strDriveName: string
  strCapacity: string
  strFreeSpace: string
  strUsedSize: string
  strDLCSize: string
  strWorkshopSize: string
  strStagedSize: string
  bIsDefaultFolder: boolean
  bIsMounted: boolean
  bIsFixed: boolean
  vecApps: App[]
}
