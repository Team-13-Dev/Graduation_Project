"use client"
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
const Onboarding = () => {
    const [fullName, setFullName] = useState<string>("")
    const [companyName, setCompanyName] = useState<string>("")
    const [companyIndustry, setCompanyIndustry] = useState<string>("Clothes & Accessories")
    const [companyLocation, setCompanyLocation] = useState<string>("Cairo")
    const [insightFrequency, setInsightFrequency] = useState<string>("daily");
    const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
    const [notifyInApp, setNotifyInApp] = useState<boolean>(true);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            setLoading(true);
            const res = await fetch("/api/sync-user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, companyName, companyIndustry, companyLocation, insightFrequency, notifyEmail, notifyInApp})
            })
            await res.json();
            if(res.status === 200){
                router.push("/dashboard")
            }
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false)
        }
    }
    //ده هيكون في الdatabase بعدين
    const industriesAvailable = [
        "Clothes & Accessories"
    ]

    const egyptianCities: string[] = [
        "Cairo",
        "Giza",
        "Alexandria",
        "Port Said",
        "Damietta",
        "Rosetta",
        "Baltim",
        "Marsa Matruh",
        "Mansoura",
        "Tanta",
        "Zagazig",
        "Damanhur",
        "Kafr El-Sheikh",
        "Luxor",
        "Aswan",
        "Qena",
        "Sohag",
        "Minya",
        "Beni Suef",
        "Assiut",
        "Hurghada",
        "Sharm El Sheikh",
        "Dahab",
        "El Gouna",
        "Marsa Alam",
        "Nuweiba",
        "Taba",
        "New Cairo",
        "New Administrative Capital",
        "10th of Ramadan City",
        "6th of October City",
        "Obour City",
        "Sadat City"
    ];

    const insightFrequencyValues : string[] = [
        "daily",
        "weekly",
        "monthly"
    ]
  return (
    <div className='w-full min-h-screen grid place-content-center bg-[#f1f5f9]'>
        <div className='absolute top-4 left-4'>
            <UserButton />
        </div>
        <div  className='lg:border-2 border-[#C5D0E6] bg-[#F1F5F9] rounded-xl text-center p-6 sm:p-8 md:p-10 lg:p-13 lg:shadow-md shadow-[#C4D0E5] mx- lg:mx-0'>
            <div className="text-left mb-12">
                <h1 className="text-primary font-medium text-2xl">
                    Welcome
                </h1>
                <h3 className="text-[#535A68] text-sm lg:text-md mt-1">Please enter your business data</h3>
            </div>
            <form onSubmit={onSubmit}>
                <div className='grid grid-cols-2 gap-8'>
                    <div className='grid gap-1 text-left'>
                        <label>
                            Your Full Name
                        </label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400 lg:min-w-[420px]'/>
                    </div>
                    <div className='grid gap-1 text-left'>
                        <label>
                            Company Name
                        </label>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className='bg-none border-b focus:outline-none focus:border-blue-600 focus:border-b duration-400 lg:min-w-[420px]'/>
                    </div>
                    <div className='grid gap-3 text-left'>
                        <label>
                            Company Industry
                        </label>
                        <select value={companyIndustry} className='px-2 border-b pb-2 focus:border-b-blue-600 focus:outline-none' onChange={(e) => setCompanyIndustry(e.target.value)}>
                            {industriesAvailable.map((industry, idx) => (
                                <option key={idx} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>
                    <div className='grid gap-3 text-left'>
                        <label>
                            Company Location
                        </label>
                        <select value={companyLocation} className='px-2 border-b pb-2 focus:border-b-blue-600 focus:outline-none' onChange={(e) => setCompanyLocation(e.target.value)}>
                            {egyptianCities.map((city, idx) => (
                                <option key={idx} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className='grid gap-3 text-left'>
                        <label>
                            How often should we send you insights?
                        </label>
                        <select value={insightFrequency} className='px-2 border-b pb-2 focus:border-b-blue-600 focus:outline-none' onChange={(e) => setInsightFrequency(e.target.value)}>
                            {insightFrequencyValues.map((freq, idx) => (
                                <option key={idx} value={freq}>{freq}</option>
                            ))}
                        </select>
                    </div>
                    <div className='grid gap-3 text-left'>
                        <h3>How would you like us to notify you?</h3>
                        <div className='flex gap-4 items-center'>
                            <div className='flex gap-2 items-center'>
                                <input id='byEmail' type='checkbox' checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)}/>
                                <label htmlFor="byEmail" >By Email</label>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input id='inApp' type='checkbox' checked={notifyInApp} onChange={(e) => setNotifyInApp(e.target.checked)}/>
                                <label htmlFor='inApp'>In Site Dashboard</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-12'>
                    <button disabled={loading} className={!loading ? "primary_btn" : "loading_btn"} type='submit'>{!loading ? "Continue" : "Loading..."}</button>
                    {/* <Button disabled={false} variant={"primary_btn"}>{"Continue"}</Button> */}
                </div>
            </form>
        </div>
    </div>
  )
}

export default Onboarding
