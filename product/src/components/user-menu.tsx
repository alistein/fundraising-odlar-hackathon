"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";

type DemoUser = { id: string; name: string };

// MOCK AUTH: switches between seeded demo users. No passwords.
export function UserMenu({ users, current }: { users: DemoUser[]; current: DemoUser | null }) {
  const router = useRouter();

  async function change(userId: string) {
    if (userId === "guest") await fetch("/api/auth/logout", { method: "POST" });
    else
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="press flex h-10 items-center gap-2 rounded-full pr-3 pl-1 text-sm font-semibold outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40">
        <UserAvatar seed={current?.id ?? "guest"} name={current?.name ?? "Qonaq"} className="size-8" />
        <span className="max-sm:hidden">{current?.name ?? "Qonaq"}</span>
        <Icon icon={ArrowDown01Icon} size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-60 rounded-xl p-1.5 shadow-strong">
        <DropdownMenuRadioGroup value={current?.id ?? "guest"} onValueChange={change}>
          <DropdownMenuRadioItem value="guest" className="gap-2.5 rounded-lg py-2">
            <UserAvatar seed="guest" name="Qonaq" className="size-7" />
            Qonaq
          </DropdownMenuRadioItem>
          {users.map((u) => (
            <DropdownMenuRadioItem key={u.id} value={u.id} className="gap-2.5 rounded-lg py-2">
              <UserAvatar seed={u.id} name={u.name} className="size-7" />
              {u.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
