import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagScripts() {
  // GTM ve gtag BİRLİKTE yüklenir. Eski kod GTM_ID varsa erken return ile gtag'i
  // (dolayısıyla Google Ads dönüşüm config'ini) hiç enjekte etmiyordu → Ads dönüşümü
  // hiç ateşlenmiyordu. GA4'ü çift saymamak için: GTM varsa GA4 config'i GTM'e bırakılır,
  // Ads config'i her durumda gtag ile yüklenir (GTM Ads dönüşümünü taşımıyor).
  const gtagId = GOOGLE_ADS_ID || GA_ID;

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      ) : null}

      {gtagId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              ${!GTM_ID && GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ''}
              ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}

export function GtmNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
