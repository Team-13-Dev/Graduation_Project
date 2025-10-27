"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function OTPVerification() {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const { signUp, setActive } = useSignUp();
    const router = useRouter();
    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setErrorMessage("");

        if (value && index < 5) inputsRef.current[index + 1]?.focus();

        if (newOtp.every((v) => v !== "")) {
        verifyOtp(newOtp.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async (code: string) => {
        if (!signUp || !setActive) return;
        setStatus("loading");

        try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
        await setActive({ session: completeSignUp.createdSessionId }); 
        setStatus("success");
        router.push("/")
        } catch (err: any) {
        console.error(err);
        setStatus("error");
        setErrorMessage("Invalid or expired code. Please try again.");
        setOtp(new Array(6).fill(""));
        inputsRef.current[0]?.focus();
        }
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-6"
        >
        <h2 className="text-2xl font-semibold tracking-wide">
            {status === "success" && "✅ Verified"}
        </h2>

        {status !== "success" && (
            <div className="w-full flex lg:justify-around gap-3">
            {otp.map((digit, i) => (
                <input
                key={i}
                ref={(el) => {
                        inputsRef.current[i] = el
                    }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={status === "loading"}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-12 h-12 lg:w-14 lg:h-14 bg-[#D9E1EF] focus:shadow-md focus:shadow-[#B6D8ED] text-center text-xl border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    status === "error" ? "border-red-500" : "focus:ring-blue-500"
                }`}
                />
            ))}
            </div>
        )}

        {status === "loading" && (
            <p className="text-gray-500 text-sm animate-pulse">Verifying...</p>
        )}

        {status === "error" && (
            <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-medium"
            >
            {errorMessage}
            </motion.p>
        )}

        {status === "success" && (
            <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="text-green-600 font-medium text-lg"
            >
            Your email has been verified successfully 🎉
            </motion.div>
        )}
        </motion.div>
    );
}

// className="w-12 h-12 bg-[#D9E1EF] text-center text-xl border rounded-xl focus:outline-none focus:shadow-md focus:shadow-[#B6D8ED] focus:ring-2 focus:ring-blue-500 transition-all"
