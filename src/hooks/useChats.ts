"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface ChatListItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook that returns the current user’s chats, loading/error flags,
 * and SWR’s mutate function for manual cache updates.
 *
 * Usage:
 * const { chats, isLoading, isError, mutate } = useChats();
 */
export function useChats() {
  const {
    data,
    error,
    isLoading,
    mutate,      // call this to re-validate after creating/deleting a chat
  } = useSWR<ChatListItem[]>("/api/chat", fetcher);

  return {
    chats: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
