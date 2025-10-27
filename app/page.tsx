import { UserAvatar, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <nav className="w-full p-4">
        <div className="container mx-auto">
          <UserButton />

        </div>
      </nav>
      <div className="flex-1 justify-center items-center text-center w-full h-full">
        Under Development...
      </div>
    </div>
  );
}
