import { FunctionComponent, ComponentProps } from 'react';

const CircleIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="5" cy="5" r="5" fill="currentColor" />
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
