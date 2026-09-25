import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import CameraLineIcon from "@iconify-react/majesticons/camera-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";
import {
  profileInitials,
  profileUpdatedEvent,
  type UserProfile,
} from "./lib/profile";
import { supabase } from "./lib/supabase";

const textareaClasses =
  "mt-2 h-11 w-full rounded-md border border-brandgray-300 bg-white px-3.5 text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10";
const maxAvatarSize = 2 * 1024 * 1024;
const avatarBucket = "profile-images";

export default function SettingsPage() {
  const { user, isAuthLoading } = useAuth();
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;

    supabase
      .from("profiles")
      .select("id, nickname, avatar_url, bio")
      .eq("id", user.id)
      .maybeSingle<UserProfile>()
      .then(({ data, error }) => {
        if (!isCurrent) return;

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else if (data) {
          setNickname(data.nickname ?? "");
          setAvatarUrl(data.avatar_url ?? "");
          setBio(data.bio ?? "");
        }

        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto h-96 max-w-2xl animate-pulse bg-brandgray-100" />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/settings" }} />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    const avatarPath = `${user.id}/avatar`;
    let savedAvatarUrl = avatarUrl.trim() || null;

    if (avatarFile) {
      const { error: uploadError } = await supabase.storage
        .from(avatarBucket)
        .upload(avatarPath, avatarFile, {
          cacheControl: "3600",
          contentType: avatarFile.type,
          upsert: true,
        });

      if (uploadError) {
        setIsSaving(false);
        setMessage({ type: "error", text: uploadError.message });
        return;
      }

      const { data } = supabase.storage
        .from(avatarBucket)
        .getPublicUrl(avatarPath);
      savedAvatarUrl = `${data.publicUrl}?v=${Date.now()}`;
    } else if (shouldRemoveAvatar) {
      const { error: removeError } = await supabase.storage
        .from(avatarBucket)
        .remove([avatarPath]);

      if (removeError) {
        setIsSaving(false);
        setMessage({ type: "error", text: removeError.message });
        return;
      }

      savedAvatarUrl = null;
    }

    const profile: UserProfile = {
      id: user.id,
      nickname: nickname.trim() || null,
      avatar_url: savedAvatarUrl,
      bio: bio.trim() || null,
    };
    const { error } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "id" });

    setIsSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setAvatarUrl(savedAvatarUrl ?? "");
    setAvatarPreview("");
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
    window.dispatchEvent(new CustomEvent(profileUpdatedEvent));
    setMessage({ type: "success", text: "Profile saved." });
  }

  function handleAvatarChange(file: File | undefined) {
    setMessage(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Choose an image file such as GIF, JPG, PNG, or WebP.",
      });
      return;
    }

    if (file.size > maxAvatarSize) {
      setMessage({
        type: "error",
        text: "The profile picture must be 2 MB or smaller.",
      });
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        setAvatarFile(file);
        setShouldRemoveAvatar(false);
        setImageFailed(false);
      }
    });
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarUrl("");
    setAvatarPreview("");
    setAvatarFile(null);
    setShouldRemoveAvatar(true);
    setImageFailed(false);
    setMessage(null);
  }

  const displayName = nickname.trim() || user.email?.split("@")[0] || "You";
  const previewSource = avatarPreview || avatarUrl.trim();
  const showImage = Boolean(previewSource) && !imageFailed;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
        </div>

        <div className="grid lg:grid-cols-[18rem_1fr]">
          <header className="border-b border-brandgray-250 bg-brandgray-50 px-4 py-8 sm:px-6 lg:min-h-[38rem] lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <span className="grid size-11 place-items-center rounded-md bg-blue-100 text-blue-700">
              <UserLineIcon aria-hidden="true" width="21" height="21" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-brand-950">
              Profile settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-brandgray-600">
              All fields are optional. These details may appear beside your
              future community contributions.
            </p>
          </header>

          <section className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <form onSubmit={handleSubmit} className="max-w-xl">
              <div className="flex items-center gap-4 border-b border-brandgray-200 pb-7">
                <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-900 text-lg font-semibold text-white">
                  {showImage ? (
                    <img
                      src={previewSource}
                      alt="Profile preview"
                      className="size-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    profileInitials(displayName) || "U"
                  )}
                </span>
                <div>
                  <p className="font-semibold text-brandgray-900">
                    {displayName}
                  </p>
                  <p className="mt-0.5 text-sm text-brandgray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-6">
                <label className="block">
                  <Label asSpan optional>
                    Nickname
                  </Label>
                  <Input
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    maxLength={40}
                    placeholder="How should people know you?"
                    autoComplete="nickname"
                  />
                </label>

                <fieldset>
                  <legend>
                    <span className="inline-flex items-center gap-2 font-semibold text-brandgray-900">
                      <CameraLineIcon
                        aria-hidden="true"
                        width="17"
                        height="17"
                      />
                      Profile picture
                    </span>
                    <span className="ml-2 text-sm text-brandgray-500">
                      Optional
                    </span>
                  </legend>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-brandgray-300 bg-white px-3.5 py-2 font-semibold text-brandgray-750 transition hover:border-brandgray-450 hover:bg-brandgray-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-900">
                      <CameraLineIcon
                        aria-hidden="true"
                        width="17"
                        height="17"
                      />
                      {showImage ? "Change image" : "Choose image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          handleAvatarChange(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />
                    </label>
                    {showImage && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="rounded-md px-3 py-2 font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-brandgray-500">
                    GIF, JPG, PNG, WebP, or another image format. Maximum 2 MB.
                  </p>
                </fieldset>

                <label className="block">
                  <Label asSpan optional>
                    Role or short bio
                  </Label>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    maxLength={160}
                    rows={3}
                    className={`${textareaClasses} h-auto min-h-24 resize-y py-3`}
                    placeholder="Frontend developer looking for a product team"
                  />
                  <span className="mt-1 block text-right text-xs text-brandgray-450">
                    {bio.length}/160
                  </span>
                </label>
              </div>

              {message && (
                <p
                  role={message.type === "error" ? "alert" : "status"}
                  className={`mt-5 border-l-2 pl-3 text-sm ${
                    message.type === "error"
                      ? "border-red-400 text-red-600"
                      : "border-brand-500 text-brand-600"
                  }`}
                >
                  {message.text}
                </p>
              )}

              <div className="mt-7 flex items-center gap-3 border-t border-brandgray-200 pt-6">
                <Button type="submit" disabled={isSaving || isLoading}>
                  {isSaving ? "Saving..." : "Save profile"}
                </Button>
                <Link
                  to="/"
                  className="rounded-md px-3 py-2 font-semibold text-brandgray-700 hover:bg-brandgray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
