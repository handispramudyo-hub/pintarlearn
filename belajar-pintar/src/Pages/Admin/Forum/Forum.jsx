import { useState, useEffect, useMemo } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import ThreadCreateModal from "./ThreadCreateModal";
import ThreadDetail from "./ThreadDetail";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { useForumCategories, useForumThreads } from "../../../utils/Hooks/useForum";
import { getAllUsers } from "../../../utils/Apis/UserApi";

const Forum = () => {
  const { user } = useAuthStateContext();
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("terbaru");
  const [tagFilter, setTagFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getAllUsers({ _limit: 1000 }).then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  const usersMap = useMemo(() => {
    const m = {};
    users.forEach((u) => { m[u.id] = u; });
    return m;
  }, [users]);

  const { data: catResult } = useForumCategories();
  const categories = catResult?.data ?? [];

  const { data: threadResult } = useForumThreads({ _limit: 1000 });
  const threadData = threadResult?.data;
  const allThreads = useMemo(() => threadData ?? [], [threadData]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allThreads.forEach((t) => { counts[t.category_id] = (counts[t.category_id] || 0) + 1; });
    return counts;
  }, [allThreads]);

  const filteredThreads = useMemo(() => {
    let result = allThreads;
    if (selectedCategory) result = result.filter((t) => t.category_id === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.judul.toLowerCase().includes(q) || t.konten.toLowerCase().includes(q));
    }
    if (tagFilter) result = result.filter((t) => t.tags?.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase()));
    if (sortBy === "terbaru") result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    else if (sortBy === "popularitas") result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    else if (sortBy === "terpecahkan") result.sort((a, b) => (b.solved ? 1 : 0) - (a.solved ? 1 : 0));
    return result;
  }, [allThreads, selectedCategory, search, tagFilter, sortBy]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    allThreads.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [allThreads]);

  const getUserName = (id) => usersMap[id]?.nama || usersMap[id]?.email || `User #${id}`;

  if (selectedThread) {
    return <ThreadDetail threadId={selectedThread} onBack={() => setSelectedThread(null)} users={usersMap} currentUser={user} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ThreadCreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} categories={categories} onCreated={() => {}} />

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <Heading as="h2" spacing="mb-0">Forum Diskusi</Heading>
          {user?.permission?.includes("forum.create") && <Button onClick={() => setShowCreateModal(true)}>+ Buat Thread Baru</Button>}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <input type="text" placeholder="Cari thread..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm min-w-[200px]" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="terbaru">Terbaru</option>
            <option value="popularitas">Popularitas</option>
            <option value="terpecahkan">Terpecahkan</option>
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="">Semua Tag</option>
            {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${!selectedCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Semua</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${selectedCategory === cat.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            {cat.icon || "💬"} {cat.nama} ({categoryCounts[cat.id] || 0})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredThreads.length === 0 ? (
          <Card><p className="text-center text-gray-400 py-6">Tidak ada thread ditemukan</p></Card>
        ) : (
          filteredThreads.map((thread) => (
            <Card key={thread.id} className="cursor-pointer hover:shadow-md transition" onClick={() => setSelectedThread(thread.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {thread.pinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">&#128204; Pin</span>}
                    {thread.solved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">&#10003; Terpecahkan</span>}
                    <h3 className="font-semibold text-gray-800">{thread.judul}</h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Oleh: {getUserName(thread.author_id)}</span>
                    <span>&#128077; {thread.upvotes || 0}</span>
                    <span>&#128172; {thread.reply_count || 0}</span>
                  </div>
                  {thread.tags?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {thread.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
export default Forum;
