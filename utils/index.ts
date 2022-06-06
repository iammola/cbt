export function capitalizeFirst(str: string) {
  const split = str.split(" ");
  return [capitalize(split[0]), ...split.slice(1)].join(" ");
}

export function capitalize(str: string) {
  return str
    ?.split(" ")
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
