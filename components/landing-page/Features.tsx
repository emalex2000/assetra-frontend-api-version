export default function Features() {
    return (
        <>
            <div className="flex flex-col gap-7 text-[10px] pb-20 px-4 md:px-8 lg:px-0">
                
                {/* Header */}
                <div className="flex flex-col text-center justify-center items-center">
                    <h1 className="font-bold text-[24px] md:text-[28px] lg:text-[32px]">
                        Powerful Features Built for Modern Organizations
                    </h1>
                    <p className="max-w-full md:max-w-2xl lg:max-w-202 text-[12px] md:text-[13px] lg:text-[14px]">
                        Our Electronic Equipment Management System provides a centralized platform for tracking 
                        and managing electronic devices across your organization. Powerful Features Built for 
                        Modern Organizations
                    </p>
                </div>

                {/* Main Section */}
                <div className="flex flex-col justify-center">

                    {/* Top layout */}
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                        
                        {/* Left Features */}
                        <div className="flex flex-col gap-8 md:gap-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-1 items-center">
                                    <img src="smart-phone-01.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                    <p className="text-[16px] md:text-[18px] lg:text-[20px]">Device Registration</p>
                                </div>
                                <p className="max-w-full md:max-w-64">
                                    Easily register and catalog all electronic devices in one place. 
                                    Record key details such as serial number, device type, model, brand, 
                                    and purchase information.
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-1 items-center">
                                    <img src="user.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                    <p className="text-[16px] md:text-[18px] lg:text-[20px]">User Allocation</p>
                                </div>
                                <p className="max-w-full md:max-w-64">
                                    Assign devices to specific users and keep track of device ownership across the 
                                    organization.
                                </p>
                            </div>
                        </div>

                        {/* Image (goes top on mobile automatically) */}
                        <div className="order-first lg:order-none">
                            <img 
                                src="dashboard-overview.png" 
                                alt="" 
                                className="w-full max-w-[300px] md:max-w-[450px] lg:max-w-125.75 h-auto"
                            />
                        </div>

                        {/* Right Features */}
                        <div className="flex flex-col gap-8 md:gap-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-1 items-center">
                                    <img src="analytics-02.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                    <p className="text-[16px] md:text-[18px] lg:text-[20px]">Reporting & Insights</p>
                                </div>
                                <p className="max-w-full md:max-w-64">
                                    View a complete record of device activity including assignments, reassignments, 
                                    and status changes
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-1 items-center">
                                    <img src="computer-phone-sync.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                    <p className="text-[16px] md:text-[18px] lg:text-[20px]">Device Reassignment</p>
                                </div>
                                <p className="max-w-full md:max-w-64">
                                    Reallocate devices between users seamlessly while maintaining a full history of previous 
                                    assignments.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mt-6">
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-1 items-center">
                                <img src="shipment-tracking.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                <p className="text-[16px] md:text-[18px] lg:text-[20px]">Country-Based Tracking</p>
                            </div>
                            <p className="max-w-full md:max-w-64">
                                Monitor where devices are located globally. Track both user location and device 
                                allocation by country
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-1 items-center">
                                <img src="work-history.png" alt="" className="w-5 h-5 md:w-6 md:h-6"/>
                                <p className="text-[16px] md:text-[18px] lg:text-[20px]">Asset History Tracking</p>
                            </div>
                            <p className="max-w-full md:max-w-64">
                                View a complete record of device activity including assignments, reassignments, and 
                                status changes
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}