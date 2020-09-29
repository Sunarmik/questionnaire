export interface IStackOverflowUser {
  reputatio: number;
  user_id: number;
  user_type: string;
  profile_image: string;
  display_name: string;
  link: string;
}
export interface IQuestions {
  owner?: IStackOverflowUser;
  title?: string;
  creation_date?: number;
  question_id?: number;
  link?: string;
  body?: string;
}

export interface IQuestionsList {
  items: IQuestions[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}
