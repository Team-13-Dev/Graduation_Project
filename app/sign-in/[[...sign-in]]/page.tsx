"use client";

import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import google_logo from "@/public/assets/logos/google_logo.png"
import Loading from "@/app/components/Ui/Loading";
import Link from "next/link";

export default function CustomSignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard", 
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const attempt = await signIn.create({
        identifier: email,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Unexpected sign-in flow: " + attempt.status);
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setError(err.errors?.[0]?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <Loading />

  return (
    <div className='w-full min-h-screen grid place-content-center bg-[#f1f5f9]'>
      <div className='lg:border-2 border-[#C5D0E6] bg-[#F1F5F9] rounded-xl text-center p-6 sm:p-8 md:p-10 lg:p-13 lg:shadow-md shadow-[#C4D0E5] mx- lg:mx-0'>
    

      <div className='grid gap-4'>
            <h1 className='text-[#003091] font-medium text-xl lg:text-2xl'>Sign in</h1>    
            <p className='text-[#babdc1] tracking-wide text-sm lg:text-md'>Join the community today</p>
            <button onClick={handleGoogleSignIn} className='border text-center mx-auto border-gray-200 shadow-xl rounded-full px-6 py-1 lg:px-12 lg:py-2 font-normal flex items-center gap-2 hover:opacity-70 hover:shadow-2xl  duration-500 cursor-pointer'>
              {isLoading ? 
                  <div className="animate-pulse">
                      Redirecting...
                  </div>
                  :
                  <>
                      <Image src={google_logo} alt='Google Logo' width={30}/>
                      <p>
                          Use Google account
                      </p>
                  </>
              }
            </button>
        </div>
        
        <div className='my-8 lg:my-12'>
                    Or
        </div>
        
        <form onSubmit={handleSignIn} className="flex flex-col gap-12">
          <div className="grid gap-1 text-left">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400 lg:min-w-[420px]'
              required
            />
          </div>
          <div className="grid gap-1 text-left">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400 lg:min-w-[420px]'
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="primary_btn"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
      <div className="text-center">
        <p className='text-black/25 mt-6'>Don't have an account? <Link href={"/sign-up"} className='text-[#003091] font-medium hover:underline underline-offset-2'>Sign Up</Link></p>
      </div>
    </div>
  );
}
