import Script from 'next/script'

const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

export function YandexMetrika() {
  if (!counterId) return null

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${counterId}', 'ym');

ym(${counterId}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});

/* EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot reachGoal.
 * На pilot path (/vyvoz-musora/*) после init читаем cookie obikhod_ab_var
 * и вызываем reachGoal AB_PILOT_v1 / AB_PILOT_v2 → operator filter в Я.Метрика
 * conversions report: count goal × variant.
 *
 * Goals «AB_PILOT_v1» и «AB_PILOT_v2» нужно создать в Я.Метрика → Цели вручную
 * (operator action). До создания reachGoal silent — не ломает init. */
(function(){
  try {
    var path = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
    if (path !== '/vyvoz-musora' && path !== '/vyvoz-musora/' && path.indexOf('/vyvoz-musora/') !== 0) return;
    var m = document.cookie.match(/(?:^|;\\s*)obikhod_ab_var=(v1|v2)\\b/);
    if (!m) return;
    ym(${counterId}, 'reachGoal', 'AB_PILOT_' + m[1]);
    /* Custom params — для cohort filter в Я.Метрика > Параметры визитов. */
    ym(${counterId}, 'params', { ab_pilot: m[1], ab_path: '/vyvoz-musora' });
  } catch (e) { /* silent — RUM не должен ломать UX */ }
})();
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- 1x1 tracking pixel, next/image не применим */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
