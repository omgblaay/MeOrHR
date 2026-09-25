export type JobComment = {
  id: string;
  userId: string | null;
  author: string;
  initials: string;
  createdAt: string;
  body: string;
};

export const commentsChangedEvent = "jobrater:comments-changed";
export const sampleCommentCount = 2;

const sampleComments: JobComment[] = [
  {
    id: "sample-marta",
    userId: null,
    author: "Marta K.",
    initials: "MK",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    body: "The first conversation was relaxed and focused on past projects. I heard back after three working days.",
  },
  {
    id: "sample-daniel",
    userId: null,
    author: "Daniel R.",
    initials: "DR",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    body: "Worth asking how often the team meets in the office. The hybrid schedule seems to vary between projects.",
  },
];

export function commentsStorageKey(jobId: number) {
  return `jobrater:comments:${jobId}`;
}

export function readComments(jobId: number): JobComment[] {
  const storedComments = window.localStorage.getItem(commentsStorageKey(jobId));
  if (!storedComments) return sampleComments;

  try {
    const parsedComments: unknown = JSON.parse(storedComments);
    return Array.isArray(parsedComments) ? parsedComments : sampleComments;
  } catch {
    return sampleComments;
  }
}

export function readCommentCount(jobId: number) {
  return readComments(jobId).length;
}

export function writeComments(jobId: number, comments: JobComment[]) {
  window.localStorage.setItem(commentsStorageKey(jobId), JSON.stringify(comments));
  window.dispatchEvent(
    new CustomEvent(commentsChangedEvent, { detail: { jobId } }),
  );
}
