import { createAvatar } from "@dicebear/core";
import * as lorelei from "@dicebear/lorelei";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";

// DiceBear "Lorelei" (CC0 1.0, by Lisa Wischofsky), generated locally — names never leave the app.
const BACKGROUNDS = ["ccf88e", "acf86c", "f4f2ec", "fdefc3"];

export function avatarUri(seed: string) {
  return createAvatar(lorelei, { seed, backgroundColor: BACKGROUNDS }).toDataUri();
}

/** `seed` decides the face; `name` is only for the alt text and fallback. */
export function UserAvatar({
  seed,
  name,
  className,
}: {
  seed: string;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarImage src={avatarUri(seed)} alt="" />
      <AvatarFallback className="bg-lime text-sm font-bold text-lime-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
