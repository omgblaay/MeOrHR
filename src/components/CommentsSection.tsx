import MessageLineIcon from "@iconify-react/majesticons/message-line";
import SendLineIcon from "@iconify-react/majesticons/send-line";
import { useState, type FormEvent } from "react";
import Button from "./Button";

type Comment = {
  id: number;
  author: string;
  initials: string;
  posted: string;
  body: string;
};

const sampleComments: Comment[] = [
  {
    id: 1,
    author: "Marta K.",
    initials: "MK",
    posted: "2 hours ago",
    body: "The first conversation was relaxed and focused on past projects. I heard back after three working days.",
  },
  {
    id: 2,
    author: "Daniel R.",
    initials: "DR",
    posted: "Yesterday",
    body: "Worth asking how often the team meets in the office. The hybrid schedule seems to vary between projects.",
  },
];

export default function CommentsSection() {
  const [comments, setComments] = useState(sampleComments);
  const [draft, setDraft] = useState("");

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = draft.trim();
    if (!body) return;

    setComments((currentComments) => [
      ...currentComments,
      {
        id: Date.now(),
        author: "You",
        initials: "YO",
        posted: "Just now",
        body,
      },
    ]);
    setDraft("");
  }

  return (
    <section className="border-b border-[#dfe3dd] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <MessageLineIcon
          aria-hidden="true"
          width="18"
          height="18"
          className="text-[#526058]"
        />
        <h2 className=" font-semibold uppercase text-[#667069]">Discussion</h2>
        <span className="text-xs font-semibold text-[#8a938d]">
          {comments.length}
        </span>
      </div>

      <form onSubmit={submitComment} className="mt-5 max-w-3xl">
        <label htmlFor="new-comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="new-comment"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Share a question or hiring insight"
          className="block w-full resize-y rounded-md border border-[#cfd5cf] bg-white px-3.5 py-3  leading-6 text-[#27322c] outline-none transition placeholder:text-[#929a95] focus:border-[#2b6558] focus:ring-3 focus:ring-[#2b6558]/10"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-[#858e88]">
            Sample discussion. New comments stay in this browser session.
          </p>
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            <SendLineIcon aria-hidden="true" width="16" height="16" />
            Post
          </Button>
        </div>
      </form>

      <div className="mt-7 max-w-3xl border-t border-[#edf0ec]">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="flex gap-3 border-b border-[#edf0ec] py-5 last:border-b-0"
          >
            <div
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e7eee8] text-xs font-bold text-[#294b40]"
            >
              {comment.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className=" font-semibold text-[#27322c]">
                  {comment.author}
                </h3>
                <span className="text-xs text-[#8a938d]">{comment.posted}</span>
              </div>
              <p className="mt-1.5  leading-6 text-[#526058]">{comment.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
