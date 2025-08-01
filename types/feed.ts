import { Id } from "@/convex/_generated/dataModel";

export interface PostData {
  _id: Id<"posts">;
  _creationTime: number;
  userId: Id<"users">;
  content: string;
  image?: string | null;
  user: {
    _id: Id<"profiles">;
    name: string;
    userName: string;
    profilePicture: string | null;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isOwner: boolean;
}

export interface CommentData {
  _id: Id<"comments">;
  _creationTime: number;
  userId: Id<"users">;
  postId: Id<"posts">;
  content: string;
  user: {
    _id: Id<"profiles">;
    name: string;
    userName: string;
    profilePicture: string | null;
  };
  isOwner: boolean;
}

export interface LikeData {
  _id: Id<"likes">;
  _creationTime: number;
  userId: Id<"users">;
  postId: Id<"posts">;
  user: {
    _id: Id<"profiles">;
    name: string;
    userName: string;
    profilePicture: string | null;
  };
}
