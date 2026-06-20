import { useQuery } from "@tanstack/react-query";
import { modulist } from "../dummyData";

export const useKelas = () =>
  useQuery({
    queryKey: ["kelas"],
    queryFn: () => {
      const saved = localStorage.getItem("materiProgress");
      return saved ? JSON.parse(saved) : modulist;
    },
    initialData: modulist,
  });
