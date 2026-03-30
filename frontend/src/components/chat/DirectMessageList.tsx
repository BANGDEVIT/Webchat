import { useChatStore } from "@/stores/userChatStore";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;
  const directConersations = conversations.filter(
    (convo) => convo.type === "direct",
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {directConersations.map((convo) => (
        <DirectMessageCard convo={convo} key={convo._id} />
      ))}
    </div>
  );
};

export default DirectMessageList;
