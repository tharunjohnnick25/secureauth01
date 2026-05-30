import { supabase } from './supabase';

type Subscription = ReturnType<typeof supabase.channel> | null;

// Simple centralized realtime manager to avoid duplicate subscriptions
const subscriptions = new Map<string, Subscription>();

export function subscribe(channelName: string, setup: (channel: any) => any) {
  if (subscriptions.has(channelName)) return subscriptions.get(channelName);

  const channel = supabase.channel(channelName);
  setup(channel);
  subscriptions.set(channelName, channel as any);
  return channel;
}

export function unsubscribe(channelName: string) {
  const channel = subscriptions.get(channelName);
  if (!channel) return;
  try {
    channel.unsubscribe();
  } catch {}
  subscriptions.delete(channelName);
}

export function clearAll() {
  for (const key of Array.from(subscriptions.keys())) {
    unsubscribe(key);
  }
}
