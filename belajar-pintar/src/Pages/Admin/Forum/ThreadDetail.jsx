import { useState, useMemo } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import ReputationBadge from "./ReputationBadge";
import { useForumThread, useForumReplies, useStoreReply, useUpdateThread } from "../../../utils/Hooks/useForum";
import { toastSuccess } from "../../../utils/Helpers/ToastHelpers";

const ThreadDetail = ({ threadId, onBack, users, currentUser }) => {
  const [replyContent, setReplyContent] = useState("");
  const [replyParent, setReplyParent] = useState(null);
  const { data: thread, isLoading: threadLoading } = useForumThread(threadId);
  const { data: replyResult } = useForumReplies(threadId);
  const { mutate: storeReply, isPending: replyPending } = useStoreReply();
  const { mutate: updateThread } = useUpdateThread();

  const [localUpvotes, setLocalUpvotes] = useState(thread?.upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(thread?.downvotes || 0);
  const [voted, setVoted] = useState(null);

  const replyData = replyResult?.data;
  const replies = useMemo(() => replyData ?? [], [replyData]);
  const isAuthor = currentUser?.id === thread?.author_id;
  const isAdmin = currentUser?.role === "admin";

  const topLevelReplies = useMemo(() => replies.filter((r) => !r.parent_id), [replies]);

  const getChildReplies = (parentId) => replies.filter((r) => r.parent_id === parentId);

  const handleVote = (type) => {
    if (voted === type) {
      setLocalUpvotes((p) => p - (type === "up" ? 1 : 0));
      setLocalDownvotes((p) => p - (type === "down" ? 1 : 0));
      setVoted(null);
    } else {
      if (voted === "up") setLocalUpvotes((p) => p - 1);
      if (voted === "down") setLocalDownvotes((p) => p - 1);
      if (type === "up") setLocalUpvotes((p) => p + 1);
      if (type === "down") setLocalDownvotes((p) => p + 1);
      setVoted(type);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    storeReply(
      {
        thread_id: threadId,
        author_id: currentUser?.id,
        konten: replyContent,
        parent_id: replyParent,
        upvotes: 0,
        is_best_answer: false,
        created_at: new Date().toISOString(),
      },
      { onSuccess: () => { setReplyContent(""); setReplyParent(null); } }
    );
  };

  const handleSolve = () => {
    updateThread({ id: threadId, data: { ...thread, solved: !thread.solved } });
  };

  const handlePin = () => {
    updateThread({ id: threadId, data: { ...thread, pinned: !thread.pinned } });
  };

  const handleBestAnswer = (replyId) => {
    updateThread({ id: threadId, data: { ...thread, best_answer_id: replyId } });
    toastSuccess("Jawaban terbaik telah dipilih");
  };

  const handleReport = () => {
    toastSuccess("Laporan berhasil dikirim ke moderator");
  };

  const getUserName = (id) => users[id]?.nama || users[id]?.email || `User #${id}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const renderReply = (reply, depth = 0) => (
    <div key={reply.id} className={`${depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""} ${reply.is_best_answer ? "bg-green-50 rounded-lg p-3" : ""} ${depth > 0 ? "" : "border rounded-lg p-3"} space-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-800">{getUserName(reply.author_id)}</span>
          <ReputationBadge upvotes={reply.upvotes || 0} />
          <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          {reply.is_best_answer && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-medium">&#10003; Jawaban Terbaik</span>}
          {isAuthor && !reply.is_best_answer && (
            <button onClick={() => handleBestAnswer(reply.id)} className="text-xs text-green-600 hover:underline cursor-pointer">Tandai Jawaban Terbaik</button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.konten}</p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>&#128077; {reply.upvotes || 0}</span>
        <button onClick={() => setReplyParent(reply.id)} className="text-blue-600 hover:underline cursor-pointer">Balas</button>
      </div>
      {getChildReplies(reply.id).map((child) => renderReply(child, depth + 1))}
    </div>
  );

  if (threadLoading) return <p className="text-center text-gray-500 py-8">Memuat thread...</p>;
  if (!thread) return <p className="text-center text-gray-400 py-8">Thread tidak ditemukan</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:underline text-sm cursor-pointer">&larr; Kembali ke Forum</button>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {thread.pinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">&#128204; Pin</span>}
              {thread.solved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">&#10003; Terpecahkan</span>}
              <Heading as="h2" spacing="mb-0" className="inline">{thread.judul}</Heading>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Oleh: <span className="font-medium text-gray-700">{getUserName(thread.author_id)}</span></span>
              <ReputationBadge upvotes={localUpvotes} />
              <span>{formatDate(thread.created_at)}</span>
            </div>
            {thread.tags?.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {thread.tags.map((tag, i) => <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{tag}</span>)}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">{thread.konten}</p>

        <div className="flex items-center gap-3 pt-3 border-t">
          <div className="flex items-center gap-1">
            <button onClick={() => handleVote("up")} className={`text-lg cursor-pointer ${voted === "up" ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}>&#128077;</button>
            <span className="text-sm font-medium text-gray-700">{localUpvotes - localDownvotes}</span>
            <button onClick={() => handleVote("down")} className={`text-lg cursor-pointer ${voted === "down" ? "text-red-600" : "text-gray-400 hover:text-red-600"}`}>&#128078;</button>
          </div>
          <div className="flex-1" />
          {isAuthor && (
            <Button size="sm" variant={thread.solved ? "warning" : "success"} onClick={handleSolve}>
              {thread.solved ? "Batalkan Terpecahkan" : "Tandai Terpecahkan"}
            </Button>
          )}
          {isAdmin && (
            <Button size="sm" variant="purple" onClick={handlePin}>
              {thread.pinned ? "Unpin Thread" : "Pin Thread"}
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={handleReport}>Laporkan</Button>
        </div>
      </Card>

      <Card>
        <Heading as="h3" spacing="mb-4">Balasan ({replies.length})</Heading>
        <div className="space-y-4">
          {topLevelReplies.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Belum ada balasan. Jadilah yang pertama!</p>
          ) : (
            topLevelReplies.map((reply) => renderReply(reply))
          )}
        </div>
      </Card>

      <Card>
        <Heading as="h3" spacing="mb-4">{replyParent ? "Balas Balasan" : "Tulis Balasan"}</Heading>
        {replyParent && (
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Membalas balasan dari <strong>{getUserName(replies.find((r) => r.id === replyParent)?.author_id)}</strong></span>
            <button onClick={() => setReplyParent(null)} className="text-red-500 hover:underline text-xs cursor-pointer">Batal</button>
          </div>
        )}
        <form onSubmit={handleReply} className="space-y-3">
          <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" placeholder="Tulis balasan Anda..." required></textarea>
          <div className="flex justify-end">
            <Button type="submit" disabled={replyPending}>{replyPending ? "Mengirim..." : "Kirim Balasan"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default ThreadDetail;
