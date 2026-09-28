import { supabase } from "./supabase";

export type RecaptchaAction = "add_offer" | "post_comment";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: RecaptchaAction }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
let scriptPromise: Promise<void> | null = null;

function loadRecaptcha() {
  if (window.grecaptcha) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("The security check could not be loaded. Please try again."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

async function createRecaptchaToken(action: RecaptchaAction) {
  if (!siteKey) {
    throw new Error("reCAPTCHA is not configured for this environment.");
  }

  await loadRecaptcha();

  if (!window.grecaptcha) {
    throw new Error("The security check could not be started. Please try again.");
  }

  await new Promise<void>((resolve) => window.grecaptcha?.ready(resolve));
  return window.grecaptcha.execute(siteKey, { action });
}

export async function submitProtectedAction<
  TResponse extends { verified: boolean },
>(
  action: RecaptchaAction,
  payload?: unknown,
) {
  const token = await createRecaptchaToken(action);
  const { data, error } = await supabase.functions.invoke<TResponse>(
    "protected-submission",
    { body: { action, token, payload } },
  );

  if (error || !data?.verified) {
    throw new Error("The security check failed. Please try again.");
  }

  return data;
}
