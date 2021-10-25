import { FunctionComponent, ComponentProps } from 'react';

const CircleIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
    )
}

const OuterCircleIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="8" cy="8" r="8" fill="#FFF" stroke="currentColor" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="5" fill="currentColor" />
        </svg>
    )
}

const LineIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="2" viewBox="0 0 2 10" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

export { CircleIcon, LineIcon };
const LoadingIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg
            {...props}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                r="10"
                cx="12"
                cy="12"
                strokeWidth="4"
                stroke="currentColor"
                className="opacity-25"
            />
            <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

