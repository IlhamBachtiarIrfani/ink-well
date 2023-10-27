import Image from 'next/image'
import ButtonComponent, { ButtonType } from '../input/button'

export default function HeaderComponent() {
    return (
        <header className='sticky top-0 left-0 right-0 z-50 bg-white border-b-4'>
            <div className='container max-w-7xl mx-auto py-5 px-5 flex justify-between items-center'>
                <Image
                    className="relative -mt-1 select-none"
                    src="/ink-well.svg"
                    alt="Ink Well Logo"
                    width={65}
                    height={40}
                    priority
                />

                <ButtonComponent
                    type={ButtonType.RED}
                    title='Create Quiz'
                    icon={
                        <span className="material-symbols-rounded">
                            east
                        </span>
                    }
                />
            </div>
        </header>
    )
}
