export function classNames(...arg: (string | string[] | { [key: string]: any } | null | undefined)[]): string {
    return [arg.filter(item => Array.isArray(item) || typeof item === "string") as (string | string[])[], (arg.filter(item => !Array.isArray(item) && typeof item === "object") as { [key: string]: any }[]).reduce((acc: string[], obj: any) => {
        acc.push(Object.keys(Object.fromEntries(Object.entries(obj ?? {}).filter(i => Boolean(i[1]) === true))).join(' '));
        return acc;
    }, [])].flat().join(' ');
}

export function generateCode() {
    return Math.floor(1e5 + Math.random() * 9e5);
}

/**
 * @link https://dev.to/sinxwal/looking-for-promise-any-let-s-quickly-implement-a-polyfill-for-it-1kga
 * @param iterable promise return value
 * @returns The first Promise that resolves or an Error if they all reject
 */
export function promiseAnyPolyfill<T>(iterable: Iterable<T | PromiseLike<T>>): Promise<T> {
    return Promise.all(
        [...iterable].map(promise => new Promise((resolve, reject) =>
            Promise.resolve(promise).then(reject, resolve)
        ))
    ).then(
        errors => Promise.reject(errors),
        value => Promise.resolve<T>(value)
    );
}
