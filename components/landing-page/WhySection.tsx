import WhyCard from "./WhyCard";

export default function WhySection(){
    return(
        <>
            <div className="flex flex-col gap-5">

                <div className="flex flex-row items-center justify-center">
                    <h1 className="text-[32px] font-bold">
                        Why Organizations Choose Our System
                    </h1>
                </div>

                <div className="
                    flex flex-col
                    md:grid md:grid-cols-2
                    lg:flex lg:flex-row lg:justify-between
                    gap-3
                ">
                    <WhyCard 
                        headerText={"Better Accountability"} 
                        text={"Know exactly who is responsible for each device"} 
                        variant={"white"}
                    />

                    <WhyCard 
                        headerText={"Centralized Asset Visibility"} 
                        text={"Track all equipment from one unified platform."} 
                        variant={"black"}
                    />

                    <WhyCard 
                        headerText={"Global Device Tracking"} 
                        text={"Monitor devices across multiple countries and locations."} 
                        variant={"white"}
                    />

                    <WhyCard 
                        headerText={"Efficient Device Reallocation"} 
                        text={"Reassign equipment quickly without losing historical records."} 
                        variant={"black"}
                    />

                    <WhyCard 
                        headerText={"Improved Operational Efficiency"} 
                        text={"Reduce administrative overhead and eliminate manual tracking."} 
                        variant={"white"}
                    />
                </div>

            </div>
        </>
    )
}