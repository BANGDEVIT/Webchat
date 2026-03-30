import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import ChatAppPage from "./pages/ChatAppPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { useThemeStore } from "./stores/useThemeStore.ts";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore.ts";
import { useSocketStore } from "./stores/useSocketStore.ts";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }
    return () => disconnectSocket(); // cleanup function chạy khi component unmount (rời trang) hoặc trước khi effect chạy lại
  }, [accessToken]);

  return (
    <>
      <TooltipProvider>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            {/* public routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ChatAppPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
}

export default App;
