"use client";
import PhoneMockup from "./PhoneMockup";

export default function HowItWorks() {
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-3 pb-20 px-4 md:px-8 lg:px-0 items-center">
                
                {/* Text Section */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-center lg:text-left">
                        How the system works
                    </h2>

                    <div className="flex flex-col gap-8 md:gap-10">
                        
                        {/* Row 1 */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                            
                            <div className="flex flex-col gap-3 md:gap-5">
                                <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold">
                                    1. Register Device
                                </h2>
                                <p className="w-full md:max-w-80 lg:w-88.75">
                                    Add all electronic equipment to the system with detailed information 
                                    such as device type, serial number, and location.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 md:gap-5">
                                <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold">
                                    2. Add Users
                                </h2>
                                <p className="w-full md:max-w-80 lg:w-88.75">
                                    Register staff members and associate them with their department and country.
                                </p>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                            
                            <div className="flex flex-col gap-3 md:gap-5">
                                <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold">
                                    3. Assign Devices
                                </h2>
                                <p className="w-full md:max-w-80 lg:w-88.75">
                                    Allocate devices to users in just a few clicks and track device ownership instantly.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 md:gap-5">
                                <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold">
                                    4. Track and Manage
                                </h2>
                                <p className="w-full md:max-w-80 lg:w-88.75">
                                    Monitor device status, track allocation history, and easily reassign devices when needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <PhoneMockup/>
            </div>
        </>
    )
}