import dosenData from "../../db/dosen.json";
import matakuliahData from "../../db/matakuliah.json";
import userData from "../../db/user.json";
import kelasData from "../../db/kelas.json";
import quizData from "../../db/quiz.json";
import quizAttemptsData from "../../db/quiz_attempts.json";
import forumCategoriesData from "../../db/forum_categories.json";
import forumThreadsData from "../../db/forum_threads.json";
import forumRepliesData from "../../db/forum_replies.json";
import achievementsData from "../../db/achievements.json";
import userAchievementsData from "../../db/user_achievements.json";
import learningAnalyticsData from "../../db/learning_analytics.json";

const DB_KEY = "belajar_pintar_db";
let db = null;

function loadDb() {
  if (db) return db;
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    db = JSON.parse(saved);
  } else {
    db = {
      dosen: dosenData,
      matakuliah: matakuliahData,
      user: userData,
      kelas: kelasData,
      quiz: quizData,
      quiz_attempts: quizAttemptsData,
      forum_categories: forumCategoriesData,
      forum_threads: forumThreadsData,
      forum_replies: forumRepliesData,
      achievements: achievementsData,
      user_achievements: userAchievementsData,
      learning_analytics: learningAnalyticsData,
    };
    saveDb();
  }
  return db;
}

function saveDb() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nextId(collection) {
  return collection.length > 0 ? Math.max(...collection.map((x) => x.id)) + 1 : 1;
}

function qs(val) {
  return (val ?? "").toString().toLowerCase();
}

function match(obj, query) {
  if (!query) return true;
  return Object.values(obj).some((v) => qs(v).includes(qs(query)));
}

function paginate(list, params) {
  const q = params?.q;
  const _sort = params?._sort || "id";
  const _order = params?._order || "asc";
  const _page = parseInt(params?._page, 10) || 1;
  const _limit = parseInt(params?._limit, 10) || list.length;
  const email = params?.email;

  let filtered = list;
  if (q) filtered = list.filter((item) => match(item, q));
  if (email) filtered = list.filter((item) => item.email === email);

  const sorted = [...filtered].sort((a, b) => {
    const va = a[_sort] ?? "";
    const vb = b[_sort] ?? "";
    const cmp = typeof va === "number" ? va - vb : qs(va).localeCompare(qs(vb));
    return _order === "desc" ? -cmp : cmp;
  });

  const total = sorted.length;
  const start = (_page - 1) * _limit;
  const data = sorted.slice(start, start + _limit);

  return { data, total };
}

const localApi = {
  get(resource, params = {}) {
    const db = loadDb();
    const list = db[resource] || [];
    if (params.id) {
      const item = list.find((x) => x.id === Number(params.id));
      return { data: item || null, status: item ? 200 : 404 };
    }
    const { data, total } = paginate(list, params);
    return {
      data,
      total,
      status: 200,
      headers: { "x-total-count": String(total) },
    };
  },

  post(resource, body) {
    const db = loadDb();
    const list = db[resource] || [];
    const item = { id: nextId(list), ...body };
    list.push(item);
    saveDb();
    return { data: item, status: 201 };
  },

  put(resource, id, body) {
    const db = loadDb();
    const list = db[resource] || [];
    const idx = list.findIndex((x) => x.id === Number(id));
    if (idx === -1) return { data: null, status: 404 };
    list[idx] = { ...list[idx], ...body, id: Number(id) };
    saveDb();
    return { data: list[idx], status: 200 };
  },

  delete(resource, id) {
    const db = loadDb();
    const list = db[resource] || [];
    const idx = list.findIndex((x) => x.id === Number(id));
    if (idx === -1) return { data: null, status: 404 };
    const removed = list.splice(idx, 1)[0];
    saveDb();
    return { data: removed, status: 200 };
  },
};

export default localApi;
