import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { User, UserPlus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Friend } from "@/types/user";
import InviteSuggestionList from "../newGroupChat/InviteSuggestionList";
import SelectedUserList from "../newGroupChat/SelectedUserList";
import { useChatStore } from "@/stores/userChatStore";
import { toast } from "sonner";

const NewGroupChatModel = () => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const { friends, getFriends } = useFriendStore();
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const { loading, createConversation } = useChatStore();

  const handleGetFriends = async () => {
    await getFriends();
  };

  //includes chỉ cần chứa bất cứ kí tự nào là nó ra
  const filteredFriends = friends.filter(
    (freind) =>
      freind.displayName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      !invitedUsers.some((u) => u._id === freind._id),
  );

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend: Friend) => {
    setInvitedUsers(invitedUsers.filter((u) => u._id !== friend._id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (invitedUsers.length === 0) {
        toast.warning("Bạn phải mời ít nhất 1 thành viên vào nhóm");
        return;
      }
      await createConversation(
        "group",
        groupName,
        invitedUsers.map((u) => u._id),
      );
      setSearch("");
      setInvitedUsers([]);
      setGroupName("");
    } catch (error) {
      console.error(
        "Lõi xảy ra khi handleSubmit trong NewGroupChatModel",
        error,
      );
    }
  };

  return (
    <Dialog>
      {/* tác dụng aschild làm cho con ko tự render ra button */}
      <DialogTrigger asChild>
        <div
          // variant="ghost"
          onClick={handleGetFriends}
          className="flex z-10 justify-center items-center size-5 rounded-full hover:bg-sidebar-accent transition cursor-pointer"
        >
          <User className="size-4" />
          {/* trong Tailwind là class để ẩn element khỏi màn hình nhưng vẫn để screen reader đọc được  */}
          <span className="sr-only">Tạo nhóm</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25 border-none ">
        <DialogHeader>
          <DialogTitle className="capitalize">Tạo nhóm chat mới</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* tên nhóm */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Tên nhóm
            </Label>
            <Input
              id="groupName"
              placeholder="Gõ tên nhóm vào đây..."
              className="glass border-border/50 focus:border-primary/5- transition-smooth"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            ></Input>
          </div>

          {/* mời thành viên */}
          <div className="space-y-2">
            <Label htmlFor="invite" className="text-sm font-semibold">
              Mời thành viên
            </Label>
            <Input
              id="ivite"
              placeholder="Tìm theo tên hiển thị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            ></Input>

            {/* danh sách gợi ý */}
            {search && filteredFriends.length > 0 && (
              <InviteSuggestionList
                filteredFriends={filteredFriends}
                onSelect={handleSelectFriend}
              />
            )}

            {/* danh sách user đã chọn */}
            <SelectedUserList
              invitedUsers={invitedUsers}
              onRemove={handleRemoveFriend}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              // disabled={loading}
              className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
            >
              {loading ? (
                <span>Đang tạo...</span>
              ) : (
                <>
                  <UserPlus />
                  Tạo Nhóm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModel;
