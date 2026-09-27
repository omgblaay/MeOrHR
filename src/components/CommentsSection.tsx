import MessageLineIcon from "@iconify-react/majesticons/message-line";
import SendLineIcon from "@iconify-react/majesticons/send-line";
import TrashLineIcon from "@iconify-react/majesticons/trash-line";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  commentsChangedEvent,
  commentsStorageKey,
  readComments,
  writeComments,
  type JobComment,
} from "../lib/comments";
import { profileInitials, type UserProfile } from "../lib/profile";
import { supabase } from "../lib/supabase";
import Button from "./Button";
import Label from "./Label";

export default function CommentsSection({ jobId }: { jobId: number }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const [comments, setComments] = useState(() => readComments(jobId));
  const [draft, setDraft] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const refreshComments = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.jobId !== jobId) return;
      setComments(readComments(jobId));
    };
    const refreshStoredComments = (event: StorageEvent) => {
      if (event.key === commentsStorageKey(jobId)) {
        setComments(readComments(jobId));
      }
    };

    window.addEventListener(commentsChangedEvent, refreshComments);
    window.addEventListener("storage", refreshStoredComments);
    return () => {
      window.removeEventListener(commentsChangedEvent, refreshComments);
      window.removeEventListener("storage", refreshStoredComments);
    };
  }, [jobId]);

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, nickname, avatar_url, bio, country_code")
        .eq("id", user.id)
        .maybeSingle<UserProfile>();

      if (isCurrent) setProfile(data ?? null);
    };

    loadProfile();
    return () => {
      isCurrent = false;
    };
  }, [user]);

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = draft.trim();
    if (!body || !user) return;

    const author =
      profile?.nickname?.trim() || user.email?.split("@")[0] || "Meor HR user";
    const newComment: JobComment = {
      id: crypto.randomUUID(),
      userId: user.id,
      author,
      initials: profileInitials(author) || "JR",
      createdAt: new Date().toISOString(),
      body,
    };

    writeComments(jobId, [...comments, newComment]);
    setDraft("");
  }

  function deleteComment(commentId: string) {
    if (!user) return;

    const comment = comments.find((item) => item.id === commentId);
    if (comment?.userId !== user.id) return;

    writeComments(
      jobId,
      comments.filter((item) => item.id !== commentId),
    );
  }

  return (
    <section
      id="discussion"
      className="scroll-mt-4 border-b border-brandgray-250 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-2">
        <MessageLineIcon
          aria-hidden="true"
          width="18"
          height="18"
          className="text-brandgray-700"
        />
        <h2 className="font-semibold uppercase text-brandgray-600">Discussion</h2>
        <span className="text-xs font-semibold text-brandgray-450">
          {comments.length}
        </span>
      </div>

      {isAuthLoading ? (
        <div className="mt-5 h-24 max-w-3xl animate-pulse rounded-md bg-brandgray-100" />
      ) : user ? (
        <form onSubmit={submitComment} className="mt-5 max-w-3xl">
          <Label htmlFor="new-comment" className="sr-only">
            Add a comment
          </Label>
          <textarea
            id="new-comment"
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share a question or hiring insight"
            className="block w-full resize-y rounded-md border border-brandgray-300 bg-white px-3.5 py-3 leading-6 text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10"
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs text-brandgray-500">
              Comments are saved in this browser for now.
            </p>
            <Button type="submit" size="sm" disabled={!draft.trim()}>
              <SendLineIcon aria-hidden="true" width="16" height="16" />
              Post
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-5 max-w-3xl border-y border-brandgray-150 py-4 text-sm text-brandgray-600">
          <Link
            to="/login"
            state={{ from: `${location.pathname}#discussion` }}
            className="font-semibold text-brand-900 underline underline-offset-4"
          >
            Log in
          </Link>{" "}
          to join the discussion.
        </p>
      )}

      <div className="mt-7 max-w-3xl border-t border-brandgray-150">
        {comments.map((comment) => {
          const canDelete = Boolean(user && comment.userId === user.id);

          return (
            <article
              key={comment.id}
              className="flex gap-3 border-b border-brandgray-150 py-5 last:border-b-0"
            >
              <div
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-850"
              >
                {comment.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="font-semibold text-brandgray-900">
                      {comment.author}
                    </h3>
                    <span className="text-xs text-brandgray-450">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  {canDelete && (
                    <Button
                      variant="icon"
                      size="icon"
                      className="-mt-1 size-8"
                      onClick={() => deleteComment(comment.id)}
                      aria-label="Delete your comment"
                      title="Delete comment"
                    >
                      <TrashLineIcon aria-hidden="true" width="16" height="16" />
                    </Button>
                  )}
                </div>
                <p className="mt-1.5 leading-6 text-brandgray-700">
                  {comment.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatRelativeTime(value: string) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000),
  );

  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) {
    const minutes = Math.floor(elapsedSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (elapsedSeconds < 86400) {
    const hours = Math.floor(elapsedSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(elapsedSeconds / 86400);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}
