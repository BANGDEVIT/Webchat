import { useChatStore } from "@/stores/userChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreeen";
import MessageItem from "./MessageItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  //ref useRef tham chiếu
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Kéo xuống khi load convo render -> uselayut -> paint
  useLayoutEffect(() => {
    if (!messagesEndRef.current) {
      return; // nếu chưa có <div ref={messagesEndRef}></div> thì xem như current là null và ko thể làm các dòng lệnh ở dưới được
    }
    messagesEndRef.current.scrollIntoView({
      // behavior: "smooth",
      block: "end",
    });
  }, [activeConversationId, messages]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    }
    try {
      await fetchMessages();
    } catch (error) {
      console.error("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;
    if (!lastMessage) return;
    const seenBy = selectedConvo?.seenBy ?? [];
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConvo]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc hội thoại này
      </div>
    );
  }

  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
      >
        <div ref={messagesEndRef}></div>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv" // như lable
          loader={<p>Đang tải ...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
              key={`${message._id}-${index}`}
              message={message}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatWindowBody;
