export const profileUpdatedEvent = "jobrater:profile-updated";

export type UserProfile = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export function profileInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
