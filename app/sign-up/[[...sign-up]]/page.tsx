"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import google_logo from "@/public/assets/logos/google_logo.png"
import Image from 'next/image'
import Button from '../../components/Ui/Button'
import OTPVerification from "@/app/components/Verification/Otp/OtpVerification";
import Link from "next/link";
import Loading from "@/app/components/Ui/Loading";

const SignUp = () => {
    const { isLoaded, signUp } = useSignUp();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
   
    const handleGoogleSignUp = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
        signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
        });
        } catch (err) {
        console.error("Google Sign-Up Error:", err);
        setLoading(false);
        }
    };


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
        await signUp.create({ emailAddress: email, password });

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setIsVerifying(true);
        } catch (err) {
        console.error("Sign up failed", err);
        }
    };

    if (!isLoaded) {
        return <Loading />;
    }
  
  return (
    <div className='w-full min-h-screen grid place-content-center bg-[#f1f5f9]'>
      <div  className='border-2 border-[#C5D0E6] bg-[#F1F5F9] rounded-xl text-center p-6 sm:p-8 md:p-10 lg:p-13 shadow-md shadow-[#C4D0E5] mx- lg:mx-0'>
        {!isVerifying ? 
            <>
                <div className='grid gap-4'>
                    <h1 className='text-[#003091] font-medium text-2xl'>Sign Up</h1>    
                    <p className='text-[#babdc1] tracking-wide'>Join the community today</p>
                    <button onClick={handleGoogleSignUp} className='border text-center mx-auto border-gray-200 shadow-xl rounded-full px-12 py-2 font-normal flex items-center gap-2 hover:opacity-70 hover:shadow-2xl  duration-500 cursor-pointer'>
                        {loading ? 
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
                <div className='my-12'>
                    Or
                </div>
                <form onSubmit={handleSignUp} >
                    <div className='grid gap-8'>
                        <div className='grid gap-1 text-left'>
                            <label>
                                Email
                            </label>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400 lg:min-w-[420px]'/>
                        </div>
                        <div className='grid gap-2 text-left'>
                            <label>
                                Password
                            </label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400'/>
                        </div>
                    </div>
                    <div id="clerk-captcha" />
                    <div className='mt-12'>
                        <Button variant='primary_btn'>sign up</Button>
                    </div>
                    <div>
                        <p className='text-black/25 mt-6'>Already a member? <Link href={"/sign-in"} className='text-[#003091] font-medium hover:underline underline-offset-2'>Sign in</Link></p>
                    </div>
                </form>
            </>
            :
            <div className="flex flex-col justify-between min-h-[50vh]">
                <div className="text-left">
                    <h1 className="text-primary font-medium text-2xl">
                        Verify account with OTP
                    </h1>
                    <h3 className="text-[#535A68]">We've sent a code to @{email}</h3>
                    <OTPVerification />
                </div>
                <div>
                    <p className="text-[#979CA6] text-sm">
                        By entering your number you agree to our <Link href={"#"} className="underline underline-offset-2">Terms and conditions</Link>
                    </p>
                </div>
            </div>
        }
      </div>
    </div>
)}

export default SignUp
