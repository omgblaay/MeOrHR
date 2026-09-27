export type JobComment = {
  id: string;
  userId: string | null;
  author: string;
  initials: string;
  createdAt: string;
  body: string;
};

export const commentsChangedEvent = "jobrater:comments-changed";

const retiredSampleCommentIds = new Set(["sample-marta", "sample-daniel"]);

export function commentsStorageKey(jobId: number) {
  return `jobrater:comments:${jobId}`;
}

export function readComments(jobId: number): JobComment[] {
  const storedComments = window.localStorage.getItem(commentsStorageKey(jobId));

  if (!storedComments) {
    return [];
  }

  try {
    const parsedComments = JSON.parse(storedComments) as JobComment[];
    if (!Array.isArray(parsedComments)) return [];

    const comments = parsedComments.filter(
      (comment) => !retiredSampleCommentIds.has(comment.id),
    );

    if (comments.length !== parsedComments.length) {
      window.localStorage.setItem(
        commentsStorageKey(jobId),
        JSON.stringify(comments),
      );
    }

    return comments;
  } catch {
    return [];
  }
}

export function readCommentCount(jobId: number) {
  return readComments(jobId).length;
}

export function writeComments(jobId: number, comments: JobComment[]) {
  window.localStorage.setItem(
    commentsStorageKey(jobId),
    JSON.stringify(comments),
  );
  window.dispatchEvent(
    new CustomEvent(commentsChangedEvent, { detail: { jobId } }),
  );
}
