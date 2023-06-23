import { languages } from "@/i18n/settings";
import { useTranslation } from "@/i18n";
import DefaultLayout from "@/components/layout/DefaultLayout";
/*
📌 pre v13 pages/_app.js and pages/_document.js have been replaced with v13 app/layout.js root layout
Good to know:
The app directory must include a root layout.tsx
❗The root layout is a Server Component by default and can not be set to a Client Component.
The root layout must define <html> and <body> tags since Next.js does not automatically create them.
You can use the head.js special file to manage <head> HTML elements, for example, the <title> element.
*/


interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

export default async function RootLayout({ children, params: { lng } }: RootLayoutProps)
{
  const { i18n } = await useTranslation("translation");
  const description = i18n.t("html.description");
  const title = i18n.t("html.title");
  return (
    <html lang={lng}>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          href="https://uploads-ssl.webflow.com/63c84d3cdae940284f6ec702/63e6bb9c155088013092c319_Favicon%20(1).png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        {languages.map((lang) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={`/${lang}`} />
        ))}
      </head>

      <body>
        {
          //👇️ DefaultLayout wraps client-side providers
        }
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
