import Link from "next/link"



export default function Hero() {
    return (
        <>
            <h2 className="text-4xl font-bold mb-4">
                <span className='text-purple-600'>Fal</span>bulous MiniMovie
            </h2>
            <h4 className='text-xl font-semibold'>Write a story scene by scene to create a mini movie!</h4>
            <div className='flex flex-row gap-2 my-4'>
                <Link target='_blank' href={"https://fal.ai"} className='hover:bg-gray-300 py-2 px-4 bg-gray-100 font-semibold'>fal.ai</Link><Link target='_blank' href={"https://github.com/iamseeley/falbulous-minimovie"} className='hover:bg-gray-300 font-semibold py-2 px-4 bg-gray-100'>source</Link>
            </div>
        </>
    ) 
}