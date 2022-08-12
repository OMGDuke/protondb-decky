import {
  DialogButton,
  Router,
  ServerAPI,
} from 'decky-frontend-lib';
import { ReactElement, useEffect, useState } from 'react';

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
      <img style={{width:"20px"}} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzJfMV8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0OTEgNDkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTEgNDkxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzFBMjIzMzt9Cgkuc3Qxe2ZpbGw6I0Y1MDA1Nzt9Cgkuc3Qye2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjwhLS0gPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ1NS4zLDQ5MUgzNS43QzE2LDQ5MSwwLDQ3NSwwLDQ1NS4zVjM1LjdDMCwxNiwxNiwwLDM1LjcsMGg0MTkuN0M0NzUsMCw0OTEsMTYsNDkxLDM1Ljd2NDE5LjcKCUM0OTEsNDc1LDQ3NSw0OTEsNDU1LjMsNDkxeiIvPiAtLT4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDcwLjUsMjQ1LjVjMC0yOS44LTM3LjMtNTguMS05NC42LTc1LjZjMTMuMi01OC4zLDcuMy0xMDQuNy0xOC41LTExOS42Yy02LTMuNS0xMi45LTUuMS0yMC41LTUuMXYyMC41CgkJYzQuMiwwLDcuNiwwLjgsMTAuNSwyLjRjMTIuNSw3LjIsMTcuOSwzNC40LDEzLjcsNjkuNGMtMSw4LjYtMi43LDE3LjctNC43LDI3Yy0xOC00LjQtMzcuNi03LjgtNTguMi0xMAoJCWMtMTIuNC0xNy0yNS4yLTMyLjQtMzguMi00NS45YzI5LjktMjcuOCw1OC00Myw3Ny00M1Y0NS4xbDAsMGMtMjUuMiwwLTU4LjIsMTgtOTEuNiw0OS4yYy0zMy40LTMxLTY2LjQtNDguOC05MS42LTQ4Ljh2MjAuNQoJCWMxOSwwLDQ3LjEsMTUuMSw3Nyw0Mi43Yy0xMi44LDEzLjUtMjUuNywyOC44LTM3LjksNDUuOGMtMjAuNywyLjItNDAuNCw1LjYtNTguMywxMC4xYy0yLjEtOS4yLTMuNy0xOC4xLTQuOC0yNi42CgkJYy00LjMtMzUsMS02Mi4zLDEzLjQtNjkuNWMyLjgtMS43LDYuMy0yLjQsMTAuNS0yLjRWNDUuNmwwLDBjLTcuNywwLTE0LjcsMS43LTIwLjcsNS4xYy0yNS44LDE0LjktMzEuNiw2MS4yLTE4LjMsMTE5LjMKCQljLTU3LjEsMTcuNi05NC4yLDQ1LjgtOTQuMiw3NS41YzAsMjkuOCwzNy4zLDU4LjEsOTQuNiw3NS42Yy0xMy4yLDU4LjMtNy4zLDEwNC43LDE4LjUsMTE5LjZjNiwzLjUsMTIuOSw1LjEsMjAuNiw1LjEKCQljMjUuMiwwLDU4LjItMTgsOTEuNi00OS4yYzMzLjQsMzEsNjYuNCw0OC44LDkxLjYsNDguOGM3LjcsMCwxNC43LTEuNywyMC43LTUuMWMyNS44LTE0LjksMzEuNi02MS4yLDE4LjMtMTE5LjMKCQlDNDMzLjQsMzAzLjUsNDcwLjUsMjc1LjMsNDcwLjUsMjQ1LjV6IE0zNTEuMSwxODQuNGMtMy40LDExLjgtNy42LDI0LTEyLjQsMzYuMmMtMy44LTcuMy03LjctMTQuNy0xMi0yMgoJCWMtNC4yLTcuMy04LjctMTQuNS0xMy4yLTIxLjVDMzI2LjUsMTc5LDMzOS4xLDE4MS40LDM1MS4xLDE4NC40eiBNMzA5LjEsMjgyLjFjLTcuMiwxMi40LTE0LjUsMjQuMS0yMi4xLDM1CgkJYy0xMy43LDEuMi0yNy41LDEuOC00MS41LDEuOGMtMTMuOSwwLTI3LjctMC42LTQxLjMtMS43Yy03LjYtMTAuOS0xNS0yMi42LTIyLjItMzQuOWMtNy0xMi0xMy4zLTI0LjItMTkuMS0zNi41CgkJYzUuNy0xMi4zLDEyLjEtMjQuNiwxOS0zNi42YzcuMi0xMi40LDE0LjUtMjQuMSwyMi4xLTM1YzEzLjctMS4yLDI3LjUtMS44LDQxLjUtMS44YzEzLjksMCwyNy43LDAuNiw0MS4zLDEuNwoJCWM3LjYsMTAuOSwxNSwyMi42LDIyLjIsMzQuOWM3LDEyLDEzLjMsMjQuMiwxOS4xLDM2LjVDMzIyLjMsMjU3LjcsMzE1LjksMjcwLDMwOS4xLDI4Mi4xeiBNMzM4LjcsMjcwLjFjNSwxMi4zLDkuMiwyNC42LDEyLjcsMzYuNQoJCWMtMTIsMi45LTI0LjcsNS40LTM3LjgsNy4zYzQuNS03LjEsOS0xNC4zLDEzLjItMjEuN0MzMzEsMjg0LjksMzM0LjksMjc3LjUsMzM4LjcsMjcwLjF6IE0yNDUuNywzNjhjLTguNS04LjgtMTcuMS0xOC42LTI1LjUtMjkuNAoJCWM4LjMsMC40LDE2LjcsMC42LDI1LjIsMC42YzguNiwwLDE3LjItMC4yLDI1LjUtMC42QzI2Mi43LDM0OS40LDI1NC4xLDM1OS4yLDI0NS43LDM2OHogTTE3Ny40LDMxNGMtMTMtMS45LTI1LjYtNC4zLTM3LjYtNy4yCgkJYzMuNC0xMS44LDcuNi0yNCwxMi40LTM2LjJjMy44LDcuMyw3LjcsMTQuNywxMiwyMkMxNjguNSwyOTkuOCwxNzIuOSwzMDcsMTc3LjQsMzE0eiBNMjQ1LjIsMTIzLjFjOC41LDguOCwxNy4xLDE4LjYsMjUuNSwyOS40CgkJYy04LjMtMC40LTE2LjctMC42LTI1LjItMC42Yy04LjYsMC0xNy4yLDAuMi0yNS41LDAuNkMyMjguMywxNDEuNywyMzYuOCwxMzEuOSwyNDUuMiwxMjMuMXogTTE3Ny4zLDE3Ny4xCgkJYy00LjUsNy4xLTksMTQuMy0xMy4yLDIxLjdjLTQuMiw3LjMtOC4yLDE0LjctMTEuOSwyMmMtNS0xMi4zLTkuMi0yNC42LTEyLjctMzYuNUMxNTEuNiwxODEuNSwxNjQuMiwxNzksMTc3LjMsMTc3LjF6IE05NC4zLDI5MgoJCWMtMzIuNS0xMy45LTUzLjUtMzItNTMuNS00Ni40YzAtMTQuNCwyMS0zMi43LDUzLjUtNDYuNGM3LjktMy40LDE2LjUtNi40LDI1LjQtOS4zYzUuMiwxOCwxMi4xLDM2LjcsMjAuNiw1NS45CgkJYy04LjQsMTkuMS0xNS4yLDM3LjctMjAuNCw1NS42QzExMC45LDI5OC41LDEwMi4zLDI5NS40LDk0LjMsMjkyeiBNMTQzLjcsNDIzYy0xMi41LTcuMi0xNy45LTM0LjQtMTMuNy02OS40CgkJYzEtOC42LDIuNy0xNy43LDQuNy0yN2MxOCw0LjQsMzcuNiw3LjgsNTguMiwxMGMxMi40LDE3LDI1LjIsMzIuNCwzOC4yLDQ1LjljLTI5LjksMjcuOC01OCw0My03Nyw0MwoJCUMxNDkuOSw0MjUuNCwxNDYuNCw0MjQuNiwxNDMuNyw0MjN6IE0zNjEuMywzNTMuMWM0LjMsMzUtMSw2Mi4zLTEzLjQsNjkuNWMtMi44LDEuNy02LjMsMi40LTEwLjUsMi40Yy0xOSwwLTQ3LjEtMTUuMS03Ny00Mi43CgkJYzEyLjgtMTMuNSwyNS43LTI4LjgsMzcuOS00NS44YzIwLjctMi4yLDQwLjQtNS42LDU4LjMtMTAuMUMzNTguNiwzMzUuNywzNjAuMiwzNDQuNiwzNjEuMywzNTMuMXogTTM5Ni42LDI5MgoJCWMtNy45LDMuNC0xNi41LDYuNC0yNS40LDkuM2MtNS4yLTE4LTEyLjEtMzYuNy0yMC42LTU1LjljOC40LTE5LjEsMTUuMi0zNy43LDIwLjQtNTUuNmM5LjEsMi44LDE3LjcsNiwyNS44LDkuNAoJCWMzMi41LDEzLjksNTMuNSwzMiw1My41LDQ2LjRDNDUwLDI1OS45LDQyOSwyNzguMiwzOTYuNiwyOTJ6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTUzLjYsNDUuNUwxNTMuNiw0NS41TDE1My42LDQ1LjV6Ii8+Cgk8Y2lyY2xlIGNsYXNzPSJzdDIiIGN4PSIyNDUuNCIgY3k9IjI0NS41IiByPSI0MS45Ii8+Cgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzM2LjgsNDUuMkwzMzYuOCw0NS4yTDMzNi44LDQ1LjJ6Ii8+CjwvZz4KPC9zdmc+Cg==" />
      <span style={{ marginLeft: 10, fontSize: 20 }}>
        {`${protonData?.tier?.charAt(0).toUpperCase()}${protonData?.tier?.slice(1)}`}
      </span>
    </DialogButton>
  ) : <div />;

  return badge;
}
