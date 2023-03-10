// types
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;
export type RequestStatus = 'idle' | 'loading' | 'failed';
export type VoidMethod = () => void;
export type CurrentLanguageType = 'en' | 'ru';
export type CurrentColorTheme = 'light' | 'dark';
export type RoleType = 'USER' | 'ADMIN';
export type UpdateUserType = 'info' | 'avatar' | 'role';
export type LikeThunkLocationType = 'user-room' | 'post-page' | 'all-posts-page';

// event handler type
export type EventHandler<T, K = void> = (event: T, param?: K) => void;

// interfaces
export interface IRequestMethods {
  get: string;
  post: string;
  delete: string;
  put: string;
  patch: string;
}

export interface ILoginRequestData {
  email: string;
  password: string;
  lang: CurrentLanguageType;
}

export interface IAuthCheckRequestData {
  lang: CurrentLanguageType;
  token: string;
}

export interface IGetOneUserRequestData {
  requestData: {
    lang: CurrentLanguageType;
    id: number;
  };
  token: string;
}

export interface IGetUsersRequestData {
  lang: string;
  searchKey: string;
}

export interface IDeleteUserRequestData {
  requestData: {
    lang: CurrentLanguageType;
    id: number;
  };
  token: string;
}

export interface IUpdateUserRequestData {
  requestData: FormData;
  token: string;
  type: UpdateUserType;
  ownId: number;
}

export interface ICreatePostRequestData {
  requestData: FormData;
  token: string;
  ownId: number;
}

export interface IDeletePostRequestData {
  lang: CurrentLanguageType;
  id: number;
  ownId: number;
  token: string;
}

export interface IRegistrationRequestData extends ILoginRequestData {
  nickname: string;
}

export interface IAuthResponse {
  token?: string;
  message: string;
}

export interface ICreatePostResponse {
  message: string;
  statusCode?: number;
  ownId: number;
}

export interface ITokenDecodeData {
  id: number;
  email: string;
  nickname: string;
  role: RoleType;
  token?: string;
}

export interface IGetOneUserResponse {
  userData?: IFullUserData;
  message: string;
  statusCode?: number;
  ownId: number;
  token?: string;
  messages?: Array<IMessageModel>;
  locationType?: LikeThunkLocationType;
}

export interface IDeleteUserResponse {
  message?: string;
  statusCode?: number;
  deletedUserId: number;
}

export interface IDeletePostResponse {
  message: string;
  statusCode?: number;
  ownId: number;
  postOwnerId?: number;
}

export interface IUpdateUserResponse {
  message: string;
  statusCode?: number;
  ownId: number;
}

export interface IFoundUserData {
  id: number;
  nickname: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  city: Nullable<string>;
  country: Nullable<string>;
  avatarSrc: Nullable<string>;
  role: string;
}

export interface ISearchUsersResponse {
  count: number;
  searchResult: Array<IFoundUserData>;
  message: string;
}

export type FullScreenMode = 'auto' | 'window' | 'fullscreen';

export interface ILocalStorageSaveData {
  token?: string;
  currentLanguage?: CurrentLanguageType;
  currentTheme?: CurrentColorTheme;
  activeChats?: OpenChats;
  chatsCollapsed?: boolean;
  fullScreenPostEdit?: FullScreenMode;
}

export interface AlertMessage {
  message?: Nullable<string>;
  severity?: 'success' | 'error';
  persist?: boolean;
}

export interface IGetOnePostRequest {
  id: number;
  lang: CurrentLanguageType;
}

export interface IGetAllPostsRequest {
  lang: CurrentLanguageType;
}

export interface IGetOnePostResponse {
  postData: IPostModel;
  message: string;
  statusCode?: number;
  locationType?: LikeThunkLocationType;
}

export interface ICreateCommentRequest {
  lang: CurrentLanguageType;
  token: string;
  postId: number;
  userId: number;
  requestData: {
    commentText: string;
  };
}

export interface ICreateCommentResponse {
  message: string;
  statusCode?: number;
}

export interface ICreateLikeRequest {
  lang: CurrentLanguageType;
  token: string;
  postId: number;
  userId: number;
  guestId: Undefinable<number>;
  locationType: LikeThunkLocationType;
}

export interface ICreateLikeResponse {
  message: string;
  statusCode?: number;
  locationType: LikeThunkLocationType;
}

export interface ISendMessageRequest {
  lang: CurrentLanguageType;
  token: string;
  requestData: {
    messageText: string;
    authorId: number;
    authorNickname: string;
    recipientId: number;
    recipientNickname: string;
  };
}

export interface ISendMessageResponse {
  message: string;
  statusCode?: number;
  messageAuthorId?: number;
  messageAuthorNickname?: string;
  messageRecipientId?: number;
  messageRecipientNickname?: string;
}

export interface IGetDialogMessagesRequest {
  lang: CurrentLanguageType;
  token: string;
  userId: number;
  interlocutorId: number;
}

export interface IGetDialogMessagesResponse {
  message: string;
  statusCode?: number;
  messages?: Array<IMessageModel>;
}

export interface IUpdatePostRequest {
  lang: CurrentLanguageType;
  postId: number;
  token: string;
  requestData: {
    postHeading: string;
    postText: string;
  };
}

export interface IUpdatePostResponse {
  message: string;
  statusCode?: number;
}

export interface IDeleteMessageRequest {
  lang: CurrentLanguageType;
  messageId: number;
  ownerId: number;
  recipientId: number;
  token: string;
}

export interface IDeleteMessageResponse {
  message: string;
  messageOwnerId: number;
  messageId: number;
  statusCode?: number;
}

export interface IGetAllPostsResponse {
  postsData: Array<IPostModel>;
  message: string;
  locationType?: LikeThunkLocationType;
  statusCode?: number;
}

export interface ICommentModel {
  id?: number;
  date: string;
  editDate?: string;
  commentText: string;
  authorNickname: string;
  authorAvatar?: string;
  authorRole: RoleType;
  postId: number;
  userId: number;
}

export interface ILikeModel {
  id?: number;
  ownerNickname: string;
  postId: number;
  userId: number;
}

export interface IPostModel {
  id?: number;
  date: string;
  editDate?: string;
  postHeading: string;
  postText: string;
  media: string | File;
  userId: number;
  ownerNickname: string;
  ownerAvatar?: string;
  ownerRole: RoleType;
  comments?: Array<ICommentModel>;
  likes?: Array<ILikeModel>;
}

export interface IMessageModel {
  id?: number;
  date: string;
  messageText: string;
  authorNickname: string;
  authorAvatarSrc?: string;
  recipientId: number;
  recipientNickname: string;
  recipientAvatarSrc?: string;
  isRead?: boolean;
  userId: number;
}

export interface IUserDialog {
  lastMessageId: number;
  lastMessageDate: string;
  lastMessageText: string;
  lastMessageAuthorNickname: string;
  authorId: number;
  authorNickname: string;
  authorAvatarSrc: Nullable<string>;
  recipientId: number;
  recipientNickname: string;
  recipientAvatarSrc: Nullable<string>;
  unreadMessages: number;
}

export interface IDeleteCommentRequest {
  lang: CurrentLanguageType;
  id: number;
  token: string;
}

export interface IDeleteCommentResponse {
  message: string;
  postId: number;
  commentOwnerId: number;
  statusCode?: number;
}

export interface IDeleteLikeRequest {
  lang: CurrentLanguageType;
  id: number;
  postId: number;
  userId: number;
  guestId: Undefinable<number>;
  token: string;
  locationType: LikeThunkLocationType;
}

export interface IDeleteLikeResponse {
  message: string;
  postId: number;
  likeOwnerId: number;
  statusCode?: number;
  locationType: LikeThunkLocationType;
}

export interface IUpdateCommentRequest {
  lang: CurrentLanguageType;
  id: number;
  token: string;
  requestData: {
    commentText: string;
  };
}

export interface IUpdateCommentResponse {
  message: string;
  postId: number;
  commentOwnerId: number;
  statusCode?: number;
}

export interface IFullUserData extends ITokenDecodeData {
  age?: Nullable<number>;
  country?: Nullable<string>;
  city?: Nullable<string>;
  avatar?: Nullable<string>;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  posts?: Array<IPostModel>;
  userDialogs?: Array<IUserDialog>;
}

export interface OpenChat {
  partnerId?: number;
  partnerAvatar?: string | null;
  partnerNickname?: string;
}

export type OpenChats = OpenChat[];

export interface IUserDataPostEvent {
  userNickname: string;
  userId: number;
}

export interface IUserDataMessageEvent {
  authorId: number;
  recipientId: number;
  authorNickname: string;
  recipientNickname: string;
}
