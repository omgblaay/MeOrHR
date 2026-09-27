import MessageLineIcon from "@iconify-react/majesticons/message-line";
import { useSyncExternalStore } from "react";
import {
  commentsChangedEvent,
  commentsStorageKey,
  readCommentCount,
} from "../lib/comments";

export default function JobCommentCount({ jobId }: { jobId: number }) {
  const count = useSyncExternalStore(
    (onStoreChange) => {
      const handleCommentChange = (event: Event) => {
        if (event instanceof CustomEvent && event.detail?.jobId !== jobId) {
          return;
        }
        onStoreChange();
      };
      const handleStorage = (event: StorageEvent) => {
        if (event.key === commentsStorageKey(jobId)) onStoreChange();
      };

      window.addEventListener(commentsChangedEvent, handleCommentChange);
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener(commentsChangedEvent, handleCommentChange);
        window.removeEventListener("storage", handleStorage);
      };
    },
    () => readCommentCount(jobId),
  );

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`${count} ${count === 1 ? "comment" : "comments"}`}
    >
      <MessageLineIcon aria-hidden="true" width="15" height="15" />
      <span>{count}</span>
    </span>
  );
}
