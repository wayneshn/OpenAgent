<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";

  let { children }: { children: any } = $props();
</script>

<div class="flex flex-col h-screen bg-background text-foreground p-4 md:p-8">
  <Card class="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg h-full overflow-hidden border-border">
    <CardHeader class="border-b px-6 py-4 bg-muted/20">
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarFallback class="bg-primary text-primary-foreground font-bold">OA</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle class="text-lg font-bold">OpenAgent</CardTitle>
          <p class="text-xs text-muted-foreground">Your Autonomous Assistant</p>
        </div>
      </div>
    </CardHeader>

    <CardContent class="flex-1 flex flex-col p-0 overflow-hidden relative">
      {@render children()}
    </CardContent>
  </Card>
</div>
