export function capitalizeFirst(str: string) {
  const split = str.split(" ");
  return [capitalize(split[0]), ...split.slice(1)].join(" ");
}

export function capitalize(str: string) {
  return str
    .split(" ")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}

export function classNames(...arg: (string | string[] | { [key: string]: any } | null | undefined)[]): string {
  return [
    arg.filter((item) => Array.isArray(item) || typeof item === "string") as (string | string[])[],
    (arg.filter((item) => !Array.isArray(item) && typeof item === "object") as { [key: string]: any }[]).reduce(
      (acc: string[], obj: any) => {
        acc.push(Object.keys(Object.fromEntries(Object.entries(obj ?? {}).filter((i) => Boolean(i[1])))).join(" "));
        return acc;
      },
      []
    ),
  ]
    .flat()
    .join(" ");
}

export function sort<T extends Record<string, unknown>>(items: T[], by: keyof T = "name") {
  return [...items].sort((a, b) => {
    const itemA = String(a[by]).toUpperCase();
    const itemB = String(b[by]).toUpperCase();
    return itemA < itemB ? -1 : itemA > itemB ? 1 : 0;
  });
}

export function generateCode() {
  return Math.floor(1e5 + Math.random() * 9e5);
}

/**
 * @link https://dev.to/sinxwal/looking-for-promise-any-let-s-quickly-implement-a-polyfill-for-it-1kga
 * @param iterable promise return value
 * @returns The first Promise that resolves or an Error if they all reject
 */
export function promiseAny<T>(iterable: Iterable<T | PromiseLike<T>>): Promise<T> {
  return Promise.all(
    [...iterable].map((promise) => new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve)))
  ).then(
    (errors) => Promise.reject(errors),
    (value) => Promise.resolve<T>(value)
  );
}
