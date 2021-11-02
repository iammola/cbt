import { FunctionComponent, ComponentProps } from 'react';

export const CircleIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
    )
}

export const CircleOutlineIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="7" cy="7" r="6.5" fill="#FFF" stroke="currentColor" strokeLinejoin="round" />
        </svg>
    )
}

export const OuterCircleIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="8" cy="8" r="8" fill="#FFF" stroke="currentColor" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="5" fill="currentColor" />
        </svg>
    )
}

export const LineIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg width="2" viewBox="0 0 2 10" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}

export const LoadingIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
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

export const MoonIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M11.59 1.617a.75.75 0 01-.047.836 7.843 7.843 0 00-1.585 4.751c0 4.293 3.388 7.74 7.527 7.74 1.141 0 2.221-.26 3.19-.727a.75.75 0 011.027.94c-1.45 3.847-5.1 6.593-9.39 6.593-5.575 0-10.062-4.63-10.062-10.301 0-.91.115-1.794.333-2.636a.75.75 0 011.452.374 9.047 9.047 0 00-.285 2.262c0 4.879 3.851 8.801 8.562 8.801 3.015 0 5.676-1.604 7.203-4.04a8.856 8.856 0 01-2.03.234c-5.003 0-9.027-4.155-9.027-9.24 0-1.438.321-2.801.895-4.017A8.565 8.565 0 006.003 5.5a.75.75 0 01-1.12-1 9.975 9.975 0 015.95-3.242.75.75 0 01.756.359z"
            />
        </svg>

    )
}

export const SunIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M12 1.25a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0V2a.75.75 0 01.75-.75zm0 18a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2a.75.75 0 01.75-.75zm0-11.5a4.25 4.25 0 103.4 1.7.75.75 0 111.2-.901A5.75 5.75 0 1112 6.25a.75.75 0 010 1.5zm-10 3.5a.75.75 0 000 1.5h2a.75.75 0 000-1.5H2zm18 0a.75.75 0 000 1.5h2a.75.75 0 000-1.5h-2zM3.97 3.97a.75.75 0 011.06 0l1.5 1.5a.75.75 0 01-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zm13.5 13.5a.75.75 0 011.06 0l1.5 1.5a.75.75 0 11-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zm-13.5 1.5a.75.75 0 101.06 1.06l1.5-1.5a.75.75 0 10-1.06-1.06l-1.5 1.5zm13.5-13.5a.75.75 0 001.06 1.06l1.5-1.5a.75.75 0 00-1.06-1.06l-1.5 1.5z"
            />
        </svg>

    )
}
