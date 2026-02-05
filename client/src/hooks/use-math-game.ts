import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CheckAnswerRequest, type CheckAnswerResponse } from "@shared/routes";
import { z } from "zod";

export function useNextQuestion() {
  return useQuery({
    queryKey: [api.questions.next.path],
    queryFn: async () => {
      const res = await fetch(api.questions.next.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch next question");
      return api.questions.next.responses[200].parse(await res.json());
    },
    refetchOnWindowFocus: false,
  });
}

export function useCheckAnswer() {
  return useMutation({
    mutationFn: async (data: CheckAnswerRequest) => {
      const validated = api.questions.check.input.parse(data);
      const res = await fetch(api.questions.check.path, {
        method: api.questions.check.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.questions.check.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to check answer");
      }

      return api.questions.check.responses[200].parse(await res.json());
    },
  });
}
