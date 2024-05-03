import Image from 'next/image'

export default function FooterComponent() {
    return (
        <header className='sticky top-0 left-0 right-0 z-50 bg-black text-white'>
            <div className='container max-w-7xl mx-auto py-7 px-5 flex flex-col sm:flex-row gap-8 justify-between items-center'>
                <div className='flex flex-col items-center sm:items-start gap-4'>
                    <Image
                        className="relative invert select-none"
                        src="/ink-well.svg"
                        alt="Ink Well Logo"
                        width={65}
                        height={40}
                        priority
                    />

                    <p className='text-slate-300 text-sm'>Made with love @ilham_irfan</p>
                </div>

                <div className='flex gap-4 items-center'>
                    <p className='text-slate-300 text-sm'>Supported by:</p>
                    <Image
                        className="relative select-none"
                        src="/logo_ub.png"
                        alt="Logo Universitas Brawijaya"
                        width={40}
                        height={40}
                        priority
                    />
                    <Image
                        className="relative select-none"
                        src="/logo_filkom.png"
                        alt="Logo Fakultas Ilmu Komputer Universitas Brawijaya"
                        width={120}
                        height={40}
                        priority
                    />
                </div>
            </div>
        </header>
    )
}
