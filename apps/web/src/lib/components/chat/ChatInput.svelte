<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Send } from "@lucide/svelte";

  let { isLoading, onSend }: { isLoading: boolean, onSend: (message: string) => void } = $props();

  let input = $state("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    input = "";
  }
</script>

<div class="p-4 bg-background">
  <form 
    onsubmit={handleSubmit} 
    class="flex gap-2 items-center"
  >
    <Input 
      bind:value={input} 
      placeholder="Type your message..." 
      disabled={isLoading}
      class="flex-1"
    />
    <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
      <Send class="h-4 w-4" />
      <span class="sr-only">Send</span>
    </Button>
  </form>
</div>
