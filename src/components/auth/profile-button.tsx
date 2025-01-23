"use client";

import { Home, Loader, LogOut } from "lucide-react";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  user: User;
}

export default function ProfileButton({ user }: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.image!} alt={user.name ?? "User avatar"} />
          <AvatarFallback>
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <Home />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : <LogOut />}
          <span>{isLoading ? "Loading..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
