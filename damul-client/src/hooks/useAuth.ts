import { getAuth } from "@/service/auth";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getAuth,
    staleTime: 1000 * 60 * 60,
  });
};

export default useAuth;
