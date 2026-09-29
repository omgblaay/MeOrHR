import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import LockLineIcon from "@iconify-react/majesticons/lock-line";
import { useState, type FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";
import { supabase } from "./lib/supabase";

type LoginLocationState = {
  from?: string;
};

function safeRedirectPath(value: string | null | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default function LoginPage() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const redirectTo = safeRedirectPath(
    new URLSearchParams(location.search).get("returnTo") ??
      (location.state as LoginLocationState | null)?.from,
  );
  const oauthError = new URLSearchParams(location.hash.slice(1)).get(
    "error_description",
  );
  const displayedError = errorMessage ?? oauthError;

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);

    const callbackUrl = new URL("/login", window.location.origin);
    callbackUrl.searchParams.set("returnTo", redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsGoogleSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  if (!isAuthLoading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main
        data-hj-suppress
        className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white"
      >
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2  font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
        </div>

        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-md">
            <span className="grid size-11 place-items-center rounded-md bg-brand-100 text-brand-900">
              <LockLineIcon aria-hidden="true" width="21" height="21" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-brand-950">
              Welcome back
            </h1>
            <p className="mt-2  leading-6 text-brandgray-600">
              Log in to save offers and manage your applications.
            </p>

            <Button
              type="button"
              variant="secondary"
              className="mt-8 h-11 w-full bg-white"
              disabled={isGoogleSubmitting || isSubmitting || isAuthLoading}
              onClick={handleGoogleSignIn}
            >
              <FcGoogle aria-hidden="true" className="size-5" />
              {isGoogleSubmitting ? "Opening Google..." : "Continue with Google"}
            </Button>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-brandgray-250" />
              <span className="text-xs font-medium uppercase text-brandgray-450">
                or
              </span>
              <span className="h-px flex-1 bg-brandgray-250" />
            </div>

            {displayedError && (
              <p
                role="alert"
                className="mb-5 border-l-2 border-red-400 pl-3 text-red-600"
              >
                {displayedError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="mb-2"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isGoogleSubmitting || isAuthLoading}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
