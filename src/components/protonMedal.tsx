import {
  DialogButton,
  Router,
  ServerAPI,
} from 'decky-frontend-lib';
import { ReactElement, useEffect, useState } from 'react';
import { SiProtondb } from 'react-icons/si';

const tierColours = {
  none: { background: 'white', text: 'black' },
  pending: { background: 'rgb(180, 199, 220)', text: 'white' },
  borked: { background: 'red', text: 'white' },
  bronze: { background: 'rgb(205, 127, 50)', text: 'black' },
  silver: { background: 'rgb(166, 166, 166)', text: 'black' },
  gold: { background: 'rgb(207, 181, 59)', text: 'black' },
  platinum: { background: 'rgb(180, 199, 220)', text: 'black' },
};

export default function ProtonMedal(
  { serverAPI, className } : {serverAPI: ServerAPI, className: string},
): ReactElement {
  const [protonData, setProtonData] = useState<{
          bestReportedTier: string
          confidence: string
          score: number
          tier: string
          total: number
          trendingTier: string
      }>();

  const splitPath = window?.location?.pathname?.split('/');
  const appId = splitPath?.[splitPath.length - 1];

  useEffect(() => {
    let ignore = false;
    async function geGameInfo() {
      const req = {
        method: 'GET', url: `https://www.protondb.com/api/v1/reports/summaries/${appId}.json`,
      };
      const res = await serverAPI.callServerMethod<{method: string, url: string}, { body: string; status: number }>('http_request', req);
      if (res.success && res.result.status === 200) {
        setProtonData(JSON.parse(res.result?.body));
      } else {
        setProtonData(undefined);
      }
    }

    if (appId?.length && !ignore) {
      geGameInfo();
    }
    return () => {
      ignore = true;
    };
  }, [appId]);

  const badge = protonData ? (
    <DialogButton
      className={className}
      type="button"
      onClick={() => {
        Router.NavigateToExternalWeb(`https://www.protondb.com/app/${appId}`);
      }}
      style={{
        top: 40,
        left: 20,
        position: 'absolute',
        background: (tierColours[protonData?.tier] || tierColours.none).background,
        zIndex: 20,
        color: (tierColours[protonData?.tier] || tierColours.none).text,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        width: 'max-content',
      }}
    >
      <SiProtondb size={20} />
      <span style={{ marginLeft: 10, fontSize: 20 }}>
        {`${protonData?.tier?.charAt(0).toUpperCase()}${protonData?.tier?.slice(1)}`}
      </span>
    </DialogButton>
  ) : <div />;

  return badge;
}
