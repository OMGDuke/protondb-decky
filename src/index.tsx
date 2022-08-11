import {
  afterPatch,
  definePlugin,
  ServerAPI,
  staticClasses,
} from 'decky-frontend-lib';
import {
  ReactElement,
} from 'react';
import { SiProtondb } from 'react-icons/si';

import ProtonMedal from './components/protonMedal';

export default definePlugin((serverAPI: ServerAPI) => {
  const patch = serverAPI.routerHook.addPatch('/library/app/:appid', (props: {path: string; children: ReactElement}) => {
    afterPatch(props.children.type, 'type', (_: any, ret: any) => {
      afterPatch(ret.props.children[0].props, 'renderChildrenFunc', (_2: any, ret2: any) => {
        afterPatch(ret2.props.children.type, 'type', (_3: any, ret3: any) => {
          // Check if the component already exists before we try to add it
          const alreadySpliced = Boolean(ret3.props.children[1].props.children.props.children.find(
            (child: any) => child?.props?.className === 'protondb-decky-indicator',
          ));
          if (!alreadySpliced) {
            ret3.props.children[1].props.children.props.children
              .splice(1, 0, <ProtonMedal serverAPI={serverAPI} className="protondb-decky-indicator" />);
          }
          return ret3;
        });
        return ret2;
      });
      return ret;
    });
    return props;
  });

  return {
    title: <div className={staticClasses.Title}>ProtonDB Badges</div>,
    icon: <SiProtondb />,
    onDismount() {
      serverAPI.routerHook.removePatch('/library/app/:appid', patch);
    },
  };
});
