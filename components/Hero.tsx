import Link from "next/link"



export default function Hero() {
    return (
        <>
            <div className="flex flex-col  text-center items-center">
                {/* <h2 className="text-4xl font-bold mb-4">
                    <span className='text-purple-600'>Fal</span>bulous MiniMovie
                </h2> */}
                <div className="flex flex-col gap-2 max-w-lg">
                    <h4 className='text-3xl md:text-5xl font-bold'>Create a mini movie</h4>
                    <p className="text-lg md:text-xl text-gray-600">Bring your stories to life, scene by scene, and watch your movie unfold.</p>
                </div>
                <div className='flex flex-row gap-2 mt-4'>
                    <Link target='_blank' href={"https://fal.ai"} className='hover:bg-gray-300 py-2 px-4 bg-gray-100 font-semibold'>fal.ai</Link><Link target='_blank' href={"https://github.com/iamseeley/falbulous-minimovie"} className='hover:bg-gray-300 font-semibold py-2 px-4 bg-gray-100'>source</Link>
                </div>
            </div>
        </>
    ) 
}