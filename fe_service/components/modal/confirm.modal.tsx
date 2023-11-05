import ButtonComponent from "../input/button"

interface ConfirmModalProps {
    onClose: () => void
    title: string
    desc: string
    positiveLabel: string
    negativeLabel: string
    onPositive?: () => void
    onNegative?: () => void
}

export default function ConfirmModal(props: ConfirmModalProps) {
    function onPositive() {
        props.onClose()

        if (props.onPositive) {
            props.onPositive()
        }
    }

    function onNegative() {
        props.onClose()

        if (props.onNegative) {
            props.onNegative()
        }
    }

    return <div className='flex flex-col gap-2 max-w-sm'>
        <h1 className='font-black text-2xl'>{props.title}</h1>
        <p>{props.desc}</p>
        <div className='flex justify-end gap-3 mt-5'>
            <ButtonComponent
                type='DARK_OUTLINED'
                title={props.negativeLabel}
                onClick={onNegative}
            />
            <ButtonComponent
                type='RED'
                title={props.positiveLabel}
                icon={<span className='material-symbols-rounded  text-lg'>
                    east
                </span>}
                onClick={onPositive}
            />
        </div>
    </div>
}