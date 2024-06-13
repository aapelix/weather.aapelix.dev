import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A weather app by aapelix" />
        <title>weather.aapelix.dev</title>
        <meta content="weather.aapelix.dev" property="og:title" />
        <meta content="A weather app by aapelix" property="og:description" />
        <meta content="https://weather.aapelix.dev" property="og:url" />
        <meta content="#1a1a1a" data-react-helmet="true" name="theme-color" />

        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="shortcut icon"
          href="/icons/basic/cloudy.png"
          type="image/x-icon"
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
