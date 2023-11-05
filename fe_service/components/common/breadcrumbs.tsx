import Link from 'next/link'
import React from 'react'

interface BreadcrumbsLink {
    name: string
    href?: string
}

interface BreadcrumbsComponentProps {
    links: BreadcrumbsLink[]
}

export default function BreadcrumbsComponent(props: BreadcrumbsComponentProps) {
    return (
        <div className='flex items-center gap-1 whitespace-nowrap flex-wrap'>
            {
                props.links.map((item, index) => {
                    const isLast = index == props.links.length - 1

                    return (
                        <>
                            {
                                item.href ?
                                    <Link
                                        className={
                                            (isLast ? 'font-bold' : 'text-gray-500') +
                                            " truncate max-w-[7rem]"}
                                        key={index} href={item.href}
                                    >
                                        {item.name}
                                    </Link>
                                    :
                                    <p className={
                                        (isLast ? 'font-bold' : 'text-gray-500') +
                                        ' truncate max-w-[7rem]'}>
                                        {item.name}
                                    </p>
                            }

                            {
                                index < props.links.length - 1 &&
                                <span className="material-symbols-rounded">
                                    navigate_next
                                </span>
                            }
                        </>
                    )
                })
            }
        </div>
    )
}
