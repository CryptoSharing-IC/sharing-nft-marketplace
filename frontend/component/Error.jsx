import React from 'react'

export default function Error (props) {
    return (
        <div>


            <section className="bg-gray py-[120px] relative z-10">
                <div className="container">
                    <div className="flex -mx-4">
                        <div className="w-full px-4">
                            <div className="mx-auto max-w-[400px] text-center">
                                <h2
                                    className="font-bold 
                  mb-2
                  text-[50px]
                  sm:text-[80px]
                  md:text-[100px]
                  leading-none
                  "
                                >
                                    Error!
                                </h2>
                                <h4
                                    className=" font-semibold text-[22px] leading-tight mb-3"
                                >
                                    Oops!
                                </h4>
                                <p className="text-lg  mb-8">
                                    the error detail is : {props.errorMsg || "unkonw"}
                                </p>
                                <a
                                    href="/"
                                    className="
                  text-base
                  font-semibold
                  text-white
                  inline-block
                  text-center
                  border border-white
                  rounded-lg
                  px-8
                  py-3
                  hover:bg-white hover:text-primary
                  transition
                  "
                                >
                                    Go To Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="
      absolute
      -z-10
      w-full
      h-full
      top-0
      left-0
      flex
      justify-between
      items-center
      space-x-5
      md:space-x-8
      lg:space-x-14
      "
                >
                    <div
                        className="w-1/3 h-full bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
                    ></div>
                    <div className="w-1/3 h-full flex">
                        <div
                            className="
            w-1/2
            h-full
            bg-gradient-to-b
            from-[#FFFFFF14]
            to-[#C4C4C400]
            "
                        ></div>
                        <div
                            className="
            w-1/2
            h-full
            bg-gradient-to-t
            from-[#FFFFFF14]
            to-[#C4C4C400]
            "
                        ></div>
                    </div>
                    <div
                        className="w-1/3 h-full bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
                    ></div>
                </div>
            </section>

        </div>
    )
}
