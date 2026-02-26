<script lang="ts">
  import MessageItem from "./MessageItem.svelte";
  import type { Message } from "$lib/types";
  import { tick } from "svelte";

  let { messages, isLoading }: { messages: Message[], isLoading: boolean } = $props();

  let scrollViewport: HTMLDivElement | undefined = $state();

  // Auto-scroll when messages change
  $effect(() => {
    // We depend on messages.length to trigger the effect
    if (messages.length >= 0 && scrollViewport) {
        scrollToBottom();
    }
  });

  async function scrollToBottom() {
    await tick();
    if (scrollViewport) {
      scrollViewport.scrollTop = scrollViewport.scrollHeight;
    }
  }
</script>

<div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={scrollViewport}>
  {#if messages.length === 0}
    <div class="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
      <p class="text-lg font-medium">No messages yet</p>
      <p class="text-sm">Start a conversation with the agent.</p>
    </div>
  {/if}
  
  {#each messages as msg}
    <MessageItem role={msg.role} content={msg.content} />
  {/each}
  
  {#if isLoading}
    <div class="flex justify-start">
      <div class="bg-muted text-foreground rounded-lg p-3 rounded-bl-none border text-sm italic opacity-70">
        Thinking...
      </div>
    </div>
  {/if}
</div>
