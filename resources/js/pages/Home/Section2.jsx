export default function Section2() {
    return (
        <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
            <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="max-w-lg">
                <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
                We are here to help you
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
                </p>
            </div>
            <img
                src="/images/section2-image.png"
                alt="Section 2 Image"
                className="w-full max-w-md mt-8 lg:mt-0"
            />
            </div>
        </div>
        </section>
    );
}