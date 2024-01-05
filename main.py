import os
import decky_plugin
from settings import SettingsManager

class Plugin:
    async def _main(self):
         self.settings = SettingsManager(name="settings", settings_directory=decky_plugin.DECKY_PLUGIN_SETTINGS_DIR)

    async def _unload(self):
        pass

    async def set_setting(self, key, value):
        self.settings.setSetting(key, value)

    async def get_setting(self, key, default):
        return self.settings.getSetting(key, default)

    async def get_settings(self, default):
        result = await self.settings.read()
        if result is None:
            return default
        else:
            return result