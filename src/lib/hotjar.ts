const hotjarSiteId = 6785842;
const hotjarSnippetVersion = 6;
const hotjarScriptId = "hotjar-tracking-script";

type HotjarFunction = {
  (...args: unknown[]): void;
  q?: unknown[][];
};

type HotjarWindow = Window &
  typeof globalThis & {
    hj?: HotjarFunction;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  };

export function loadHotjar() {
  if (document.getElementById(hotjarScriptId)) return;

  const hotjarWindow = window as HotjarWindow;
  const queuedHotjar: HotjarFunction =
    hotjarWindow.hj ??
    ((...args: unknown[]) => {
      queuedHotjar.q = queuedHotjar.q ?? [];
      queuedHotjar.q.push(args);
    });

  hotjarWindow.hj = queuedHotjar;
  hotjarWindow._hjSettings = {
    hjid: hotjarSiteId,
    hjsv: hotjarSnippetVersion,
  };

  const script = document.createElement("script");
  script.id = hotjarScriptId;
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${hotjarSiteId}.js?sv=${hotjarSnippetVersion}`;
  document.head.appendChild(script);
}

export function clearHotjarBrowserData() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name.startsWith("_hj"));
  const hostname = window.location.hostname;
  const domains = ["", hostname, `.${hostname}`];

  for (const name of cookieNames) {
    for (const domain of domains) {
      const domainAttribute = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax`;
    }
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);
      if (key?.startsWith("_hj")) storage.removeItem(key);
    }
  }
}

export function hotjarIsLoaded() {
  return document.getElementById(hotjarScriptId) !== null;
}
