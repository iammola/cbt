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

export const HomeIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M9.737 2.94c-.92.57-2.003 1.434-3.515 2.643l-.205.164c-1.69 1.353-2.36 1.906-2.753 2.63a4.248 4.248 0 00-.18.374c-.32.76-.334 1.628-.334 3.794V17A4.25 4.25 0 007 21.25c.69 0 1.25-.56 1.25-1.25v-4a3.75 3.75 0 117.5 0v4c0 .69.56 1.25 1.25 1.25A4.25 4.25 0 0021.25 17v-4.455c0-2.166-.014-3.034-.334-3.794a4.265 4.265 0 00-.18-.373c-.234-.433-.582-.823-1.228-1.383a.75.75 0 01.983-1.133c.695.603 1.202 1.134 1.564 1.8.089.165.17.334.243.506.453 1.073.452 2.268.452 4.205V17A5.75 5.75 0 0117 22.75 2.75 2.75 0 0114.25 20v-4a2.25 2.25 0 00-4.5 0v4A2.75 2.75 0 017 22.75 5.75 5.75 0 011.25 17v-4.455-.172c0-1.937 0-3.132.452-4.205.073-.172.154-.341.243-.505.555-1.025 1.489-1.77 3.001-2.98.045-.036.09-.071.134-.108l.205-.163.038-.031c1.465-1.172 2.618-2.094 3.624-2.717C9.98 1.024 10.932.654 12 .654c1.795 0 3.305 1.06 5.464 2.762a.75.75 0 01-.928 1.178c-2.243-1.768-3.347-2.44-4.536-2.44-.686 0-1.36.227-2.263.786z"
            />
        </svg>
    )
}

export const FileTextIcon: FunctionComponent<ComponentProps<'svg'>> = (props) => {
    return (
        <svg
            {...props}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M13.25 2.772c-.34-.02-.784-.022-1.472-.022H11.5c-1.175 0-2.019 0-2.685.046-.659.045-1.089.131-1.441.278a4.25 4.25 0 00-2.3 2.3c-.147.352-.233.782-.278 1.441-.046.666-.046 1.51-.046 2.685v.5a.75.75 0 01-1.5 0v-.528c0-1.141 0-2.036.05-2.759.05-.735.153-1.347.388-1.913A5.75 5.75 0 016.8 1.688c.566-.235 1.178-.338 1.913-.389.723-.049 1.618-.049 2.76-.049h.397c1.045 0 1.688 0 2.304.136a5.75 5.75 0 011.844.764c.532.34.987.794 1.726 1.533l.064.065.38.379.07.07c.797.797 1.289 1.289 1.645 1.87a5.75 5.75 0 01.688 1.662c.16.662.16 1.357.159 2.486v3.819c0 1.371 0 2.447-.07 3.311-.072.88-.221 1.607-.557 2.265a5.75 5.75 0 01-2.513 2.513c-.658.336-1.385.485-2.265.556-.864.071-1.94.071-3.311.071h-.562c-1.141 0-2.036 0-2.759-.05-.735-.05-1.347-.153-1.913-.388A5.75 5.75 0 013.688 19.2c-.235-.566-.339-1.178-.389-1.913-.049-.723-.049-1.618-.049-2.76V14a.75.75 0 011.5 0v.5c0 1.175 0 2.019.046 2.685.045.659.131 1.089.278 1.441a4.25 4.25 0 002.3 2.3c.352.147.782.233 1.441.278.666.046 1.51.046 2.685.046h.5c1.412 0 2.427 0 3.223-.066.787-.064 1.295-.188 1.707-.397a4.25 4.25 0 001.857-1.857c.21-.412.333-.92.397-1.707.065-.796.066-1.81.066-3.223v-3.686c0-1.259-.005-1.766-.117-2.235a4.25 4.25 0 00-.51-1.229c-.251-.41-.607-.773-1.497-1.663l-.378-.378c-.824-.824-1.16-1.154-1.536-1.393a4.246 4.246 0 00-.462-.256V6c0 .69.56 1.25 1.25 1.25h1a.75.75 0 010 1.5h-1A2.75 2.75 0 0113.25 6V2.772zM9 11.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zM8.25 16a.75.75 0 01.75-.75h4a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
            />
        </svg>
    );
}