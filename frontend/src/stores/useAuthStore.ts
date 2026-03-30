import { create } from "zustand"; // Hàm chính zustand để tạo 1 store
import { toast } from "sonner"; // Hiển thị thông báo
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./userChatStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // generic type của Zustand trong TypeScript, Nó dùng để định nghĩa kiểu dữ liệu của store.AuthState nói với TypeScript rằng: Store này sẽ có các state và function đúng theo kiểu AuthState
      accessToken: null,
      user: null,
      loading: false, // theo dõi trạng thái khi gọi API // có 3 trạng thái loading, success, error

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
        useChatStore.getState().reset();
      },

      setAccessToken: (accessToken: string) => {
        set({ accessToken });
      },

      setUser: (user) => {
        set({ user });
      },

      signUp: async (firstName, lastName, username, email, password) => {
        try {
          set({ loading: true });

          // goi api
          await authService.signUp(
            username,
            password,
            firstName,
            lastName,
            email,
          );

          toast.success(
            "Đăng ký thành công, Bạn sẽ được chuyển sang trang đang nhập.",
          );
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký thất bại.");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });
          localStorage.clear();
          useChatStore.getState().reset(); // getState() l là trả về toàn bộ state hiện tại
          const { accessToken } = await authService.signIn(username, password);
          // set({ accessToken: accessToken });
          get().setAccessToken(accessToken);

          await get().fetchMe();
          useChatStore.getState().fetchConversations();
          toast.success(
            "Đăng nhập thành công, Bạn sẽ được chuyển sang trang chủ.",
          );
        } catch (error) {
          console.error(error);
          toast.error("Đăng nhập thất bại.");
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();
          get().clearState();
          toast.success("Đăng xuất thành công.");
        } catch (error) {
          console.error(error);
          toast.error("Đăng xuất thất bại.");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user: user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại.");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe } = get();
          const accessToken = await authService.refresh();
          // set({ accessToken });
          get().setAccessToken(accessToken);
          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          toast.error(
            "Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại.",
          );
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // chon phần nào trong state sẽ được lưu => trong localstorage chỉ lưu với giá trị user => làm cho app load nhanh hơn sau mỡi lần vào lại
    },
  ),
);

// mỗi lần logout cần xóa user trong storage
