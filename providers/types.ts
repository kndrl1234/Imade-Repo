export type  Profile = {
    id: string;
    username: string;
    avatar_url: string | null;
    save_number: number;
    follower_number: number;
    following_number: number;
    like_number: number;
    share_number: number;
    description: string;
  };

export type Content = {
  id: string;
  created_at: string;
  description: string;
  username: string;
  like_number: number;
  dislike_number: number;
  save_number: number;
  video: string;
  thumbnail_url: string;
  title: string;
  user_id: string;
  user: {
    avatar_url: string;
  };
}

export type Relation = {
  id: string;
  user_id: string;
  post_id: string;
}

export type Follow = {
  id: string;
  follower_id: string;
  user_id: string;
}

export type Comment = {
  id: string;
  created_at: Date | string;
  comment: string;
  user_id: string;
  post_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}