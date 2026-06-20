import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../Utils/AxiosInstance";

export const useChartData = () =>
  useQuery({
    queryKey: ["chart", "dashboard"],
    queryFn: async () => {
      const [dosenRes, matkulRes, userRes] = await Promise.all([
        AxiosInstance.get("/dosen"),
        AxiosInstance.get("/matakuliah"),
        AxiosInstance.get("/user"),
      ]);
      const dosen = dosenRes.data ?? [];
      const matkul = matkulRes.data ?? [];
      const users = userRes.data ?? [];

      const matkulPerSemester = Object.entries(
        matkul.reduce((acc, m) => {
          acc[m.semester] = (acc[m.semester] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([semester, count]) => ({ semester: `Semester ${semester}`, count }))
        .sort((a, b) => a.semester.localeCompare(b.semester));

      const userByRole = Object.entries(
        users.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {})
      ).map(([role, count]) => ({ role, count }));

      return {
        matkulPerSemester,
        userByRole,
        stats: { totalDosen: dosen.length, totalMatkul: matkul.length, totalUser: users.length },
      };
    },
  });
