import { FiCheck } from "react-icons/fi";

export default function SectionC() {
  return (
    <>

      <div className="
        pt-20
        flex
        flex-col
        lg:flex-row
        gap-8
        items-center
      ">

        {/* LEFT CONTENT */}

        <div className="flex flex-col gap-3 text-[14px]">

          <h1 className="text-[28px] lg:text-[32px] max-w-119.5">
            Secure and Reliable Asset Management
          </h1>

          <p className="max-w-94.5">
            Your organization's data and asset records are protected with modern security standards.
          </p>

          <p className="text-[16px] font-bold">
            The system includes:
          </p>

          {/* Features */}

          <div className="flex flex-col gap-2 text-[14px]">
            {[
              "Secure authentication",
              "Role-based access control",
              "Encrypted data handling",
              "Reliable database storage",
            ].map((item, index) => (

              <div key={index} className="flex items-start gap-2">
                <FiCheck className="text-blue-600 mt-1 shrink-0" />

                <p className="text-sm sm:text-base text-gray-700">
                  {item}
                </p>
              </div>

            ))}
          </div>

          <p className="w-full max-w-124.25">
            This ensures that sensitive asset information remains protected
            and accessible only to authorized administrators
          </p>

        </div>


        {/* RIGHT IMAGE SECTION */}

        <div
          style={{ backgroundImage: "url(./desktop.png)" }}
          className="
            relative

            w-full
            max-w-[616px]

            h-[260px]
            md:h-[320px]
            lg:h-[346.5px]

            overflow-hidden
            bg-no-repeat
            bg-center
            bg-contain
            p-6
          "
        >

          {/* Chart 1 */}

          <img
            src="chart8.png"
            alt=""
            className="
              absolute
              top-[40px]
              left-[30px]

              w-[90px]
              md:w-[110px]

              float1
            "
          />

          {/* Chart 2 */}

          <img
            src="chart-3.png"
            alt=""
            className="
              absolute
              top-[110px]
              right-[30px]

              w-[85px]
              md:w-[105px]

              float2
            "
          />

          {/* Mobile */}

          <img
            src="Mobile-breakpoint.png"
            alt=""
            className="
              absolute
              bottom-[15px]
              left-[50%]
              -translate-x-1/2

              w-[70px]
              md:w-[90px]

              float3
            "
          />

        </div>

      </div>

    </>
  );
}