import Button from "./landing_page/Button";

export default function Footer(){
    return(
        <>
            <div className="
                bg-black 
                text-white 
                flex 
                flex-col 
                p-4 
                pt-10 
                items-center 
                text-center 
                justify-center 
                gap-10
            ">

                {/* Heading */}

                <h1 className="
                    text-[24px] 
                    md:text-[28px] 
                    lg:text-[32px] 
                    max-w-full 
                    lg:max-w-199.5
                ">
                    Manage, track, and allocate your organization's devices from one powerful platform.
                </h1>


                {/* Email + Button */}

                <div className="
                    flex 
                    flex-col 
                    sm:flex-row 
                    gap-2 
                    w-full 
                    max-w-[420px]
                ">

                    <input 
                        type="text" 
                        placeholder="Enter your email" 
                        className="
                            focus:outline-none 
                            border 
                            rounded-md 
                            w-full 
                            sm:w-90 
                            p-2 
                            border-white
                        "
                    />

                    <Button 
                        text={"Try now"} 
                        variant={"white"} 
                        className="bg-white text-black w-full sm:w-30 " 
                        href={""}
                    />

                </div>


                {/* Links */}

                <div className="
                    flex 
                    flex-wrap 
                    justify-center 
                    gap-x-6 
                    gap-y-2
                    max-w-220.5
                ">

                    <a href="">Features</a>
                    <a href="">Plans & Pricing</a>
                    <a href="">News & Blogs</a>
                    <a href="">Careers</a>
                    <a href="">About Us</a>
                    <a href="">Terms</a>
                    <a href="">Privacy</a>
                    <a href="">Cookies</a>

                </div>

            </div>
        </>
    )
}