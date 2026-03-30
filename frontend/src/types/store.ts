import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;

  signUp: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void; // hà,m chuyển qua lại sáng và tối
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll
      nextCursor?: string | null; // phân trang
    }
  >;
  activeConversationId: string | null; // lưu ID của 1 cuộc trò chuyện đang mở nếu người dùng kích vào 1 hộp chat giá trị này sẽ được cập nhật theo ID của cuộc hội thoại
  convoLoading: boolean;
  messageLoading: boolean;
  loading: boolean;
  reset: () => void; // đưa các state về giá trị mặc định
  setActiveConversation: (id: string | null) => void; // để những component khác cập nhật active conversation
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;

  sendGroupMessage: (
    coversationId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  // add message
  addMessage: (message: Message) => Promise<void>;
  //updateConvo
  updateConversation: (conversation: unknown) => void;
  markAsSeen: () => Promise<void>;
  addConvo: (convo: Conversation) => Promise<void>;
  createConversation: (
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  friends: Friend[];
  searchUserByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
}
