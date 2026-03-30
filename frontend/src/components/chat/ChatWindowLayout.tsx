import { useChatStore } from "@/stores/userChatStore";
import ChatWelcomeScreeen from "./ChatWelcomeScreeen";
import ChatWindownSkeleton from "./ChatWindownSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindownHeader from "./ChatWindownHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import { useEffect } from "react";

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    messages,
    markAsSeen,
  } = useChatStore();

  const selectConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectConvo) {
      return;
    }
    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error(error);
      }
    };
    markSeen();
  }, [markAsSeen, selectConvo]);

  if (!selectConvo) {
    return <ChatWelcomeScreeen />;
  }

  if (loading) {
    return <ChatWindownSkeleton />; // mô phỏng nội dung giả các nội dung sắp hiện ra
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindownHeader />
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>
      {/* Footer */}
      <MessageInput selectedConvo={selectConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
