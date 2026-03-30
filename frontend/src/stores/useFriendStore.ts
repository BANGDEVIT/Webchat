import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import type { Friend } from "@/types/user";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  loading: false,
  receivedList: [],
  sentList: [],
  friends: [],
  searchUserByUsername: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchUserByUserName(username);
      return user;
    } catch (error) {
      console.log("lỗi xảy khi searchUserByUsername", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      // console.log("ok");
      const resultMessage = await friendService.sendFriendRequest(to, message);
      return resultMessage;
    } catch (error) {
      console.error("lỗi xảy ra khi addfriend", error);
      return "Lỗi xảy ra khi gửi kết bạn, hãy thử lại";
    } finally {
      set({ loading: false });
    }
  },
  getAllFriendRequests: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequest();
      if (!result) {
        return;
      }
      const { sent, received } = result;
      set({ sentList: sent, receivedList: received });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
  acceptRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error("lỗi ở accepRequest", error);
    } finally {
      set({ loading: false });
    }
  },
  declineRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineRequest(requestId);
      set((state) => ({
        receivedList: state.receivedList.filter((r) => r._id !== requestId),
      }));
    } catch (error) {
      console.error("Lỗi ở declineRequest", error);
    } finally {
      set({ loading: false });
    }
  },
  getFriends: async () => {
    try {
      set({ loading: true });
      const friendList = await friendService.getFriendList();
      set({ friends: friendList });
    } catch (error) {
      console.error("Lỗi xảy ra ở getFiends ", error);
    } finally {
      set({ loading: false });
    }
  },
}));
