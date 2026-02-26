<script lang="ts">
  import ChatContainer from "$lib/components/chat/ChatContainer.svelte";
  import MessageList from "$lib/components/chat/MessageList.svelte";
  import ChatInput from "$lib/components/chat/ChatInput.svelte";
  import type { Message } from "$lib/types";
  import { Separator } from "$lib/components/ui/separator";

  let messages: Message[] = $state([]);
  let isLoading = $state(false);

  async function handleSend(content: string) {
    if (isLoading) return;

    messages = [...messages, { role: "user", content }];
    isLoading = true;

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      messages = [...messages, { role: "assistant", content: "" }];

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; // Keep the incomplete line in buffer

        for (const line of lines) {
            if (line.trim() === "") continue;
            if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.text) {
                        assistantMessage += parsed.text;
                        // Update UI
                        const newMessages = [...messages];
                        newMessages[newMessages.length - 1] = { 
                            role: "assistant", 
                            content: assistantMessage 
                        };
                        messages = newMessages;
                    }
                    if (parsed.error) {
                        throw new Error(parsed.error);
                    }
                } catch (e) {
                    console.error("Error parsing SSE data:", e);
                }
            }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      messages = [...messages, { role: "assistant", content: "Sorry, something went wrong." }];
    } finally {
      isLoading = false;
    }
  }
</script>

<ChatContainer>
  <MessageList {messages} {isLoading} />
  <Separator />
  <ChatInput {isLoading} onSend={handleSend} />
</ChatContainer>
