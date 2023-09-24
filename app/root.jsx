import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { GlobalDataProvider } from "~/components/billingctx";

export default function App() {
  return (
    <GlobalDataProvider>
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <LiveReload />
          <Scripts />
        </body>
      </html>
    </GlobalDataProvider>
  );
}
