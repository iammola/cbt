export function classNames(...arg: (string | string[] | { [key: string]: any } | null | undefined)[]): string {
    return [arg.filter(item => Array.isArray(item) || typeof item === "string") as (string | string[])[], (arg.filter(item => !Array.isArray(item) && typeof item === "object") as { [key: string]: any }[]).reduce((acc: string[], obj: any) => {
        acc.push(Object.keys(Object.fromEntries(Object.entries(obj ?? {}).filter(i => Boolean(i[1]) === true))).join(' '));
        return acc;
    }, [])].flat().join(' ');
}

export function generateCode() {
    return Math.floor(1e5 + Math.random() * 9e5);
}
