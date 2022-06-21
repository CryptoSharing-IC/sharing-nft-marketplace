import React from 'react'

export default function Progress () {
    return (
        <section className="bg-gray py-[120px] relative z-10  min-h-[522px]">
            <div className="container">
                <div className="flex -mx-4 justify-center">
                    <div className="w-full px-4">
                        <div className="mx-auto max-w-[400px] text-center">
                            <h2
                                className="font-bold text-black  mb-2 text-[30px] sm:text-[30px] md:text-[30px] leading-none">
                                In Progress
                            </h2>
                            <progress className="progress w-96"></progress>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
