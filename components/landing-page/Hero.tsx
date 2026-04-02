"use client";
import { FaArrowRight } from "react-icons/fa";
import Button from "./Button";
import HeroHeading from "./HeroHeading";
import HeroImage from "./Heroimage";
import HeroRight from "./HeroRight";

export default function Hero(){
    return(
        <>
            <div className="flex flex-col gap-6 items-center text-center pb-3 pt-20">
                <HeroHeading 
                mainText={"Take Full Controll"} 
                highlightText={"Of Your Organisations"}
                animateWords
                words={[
                    "Electronic Devices",
                    "Farm Equipment",
                    "Office Equipment",
                    "Event Equipment",
                ]}
                />
                <p className="max-w-166">
                    Assetra is a centralized asset management system that helps organizations 
                    register, track, assign, and manage electronic equipment across users and 
                    countries all from one powerful dashboard
                </p>
                <div className="flex flex-row gap-3">
                    <Button 
                        text={"Get Started"}
                        variant={"black"}
                        icon={FaArrowRight}
                        iconPosition="right" href={"/register"}
                        />
                    
                    <Button 
                        text={"Explore Features"}
                        variant={"white"} href={""}
                        />
                </div>
            </div>
                
            <div className="flex flex-col lg:flex-row items-center gap-10">
                <HeroImage />
                <HeroRight />
            </div>
        </>
    )
}