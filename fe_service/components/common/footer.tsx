import Image from 'next/image'

export default function FooterComponent() {
    return (
        <header className='sticky top-0 left-0 right-0 z-50 bg-black text-white'>
            <div className='container max-w-7xl mx-auto py-5 px-5 flex justify-between items-center'>
                <Image
                    className="relative -mt-1 invert select-none"
                    src="/ink-well.svg"
                    alt="Ink Well Logo"
                    width={65}
                    height={40}
                    priority
                />

                <p>Made with love @ilham_irfan</p>
            </div>
        </header>
    )
}
