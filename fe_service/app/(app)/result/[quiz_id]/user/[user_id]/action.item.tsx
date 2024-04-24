import React from 'react'

import Moment from 'moment';

interface ActionItemProps {
    action: string,
    detail: JSON,
    createdAt: string,
}

export default function ActionItem(props: ActionItemProps) {

    function prettyString(value: string) {
        return value.replace(/_/g, " ").toLowerCase();
    }

    return (
        <tr className='even:bg-gray-100'>
            <td className='rounded-s-lg px-3 py-2 whitespace-nowrap capitalize'>
                {prettyString(props.action)}
            </td>
            <td className='px-3 py-2 text-xs text-gray-500'>
                {props.detail && Object.entries(props.detail).map(([key, value], index) => (
                    <div key={index} className='flex gap-4'>
                        <p className='font-medium capitalize'>{prettyString(key)}</p>
                        <p className='line-clamp-1'>{value.toString()}</p>
                    </div>
                ))}
            </td>
            <td className='rounded-e-lg px-3 py-2 whitespace-nowrap'>
                {Moment(props.createdAt).format('d MMM YYYY - HH:mm:ss')}
            </td>
        </tr>
    )
}
