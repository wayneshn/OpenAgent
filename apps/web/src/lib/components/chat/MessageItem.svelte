<script lang="ts">
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";

  let { role, content }: { role: "user" | "assistant"; content: string } = $props();

  let isUser = $derived(role === "user");
</script>

<div class={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
  <div class={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
    <Avatar class="h-8 w-8">
      <AvatarFallback class={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
        {isUser ? "U" : "Ai"}
      </AvatarFallback>
    </Avatar>
    
    <div 
      class={`rounded-lg p-3 text-sm ${
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-none' 
          : 'bg-muted text-foreground rounded-tl-none border'
      }`}
    >
      <div class="whitespace-pre-wrap">{content}</div>
    </div>
  </div>
</div>
