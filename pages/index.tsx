import useSWR from 'swr';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { ClipboardEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react';

import { classNames } from 'utils';
import Image1 from "/public/BG.jpg";
import { LoadingIcon } from 'components/Misc/Icons';

const Home: NextPage = () => {
    const router = useRouter();
    const [, setCookies] = useCookies(['account']);
    const { data: dbState } = useSWR('/api/ping/', url => fetch(url).then(res => res.json()));

    const [active, setActive] = useState(0);
    const [code, setCode] = useState<string[]>(Array.from({ length: 6 }));

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | undefined>();

    const focusPrevious = (index: number) => setActive(--index >= 0 ? index : 0);

    const focusNext = (index: number) => setActive(++index < code.length ? index : 0);

    function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text');

        if (/^\d{6}$/.test(pasted)) {
            setCode(pasted.split(''));
            setActive(5);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/login/', {
                method: "POST",
                body: JSON.stringify({ code: code.join('') })
            });
            const { success, error, data } = await res.json();

            setSuccess(success);
            if (success === true) {
                setTimeout(router.push, 55e1, router.query.to === undefined ? '/home' : decodeURIComponent(router.query.to as string));
                setCookies("account", JSON.stringify(data), {
                    path: '/',
                    sameSite: true
                });
            } else throw new Error(error);
        } catch (error) {
            console.log({ error });
        }

        setLoading(false);
        setTimeout(setSuccess, 5e2, undefined);
    }

    return (
        <>
            <Head>
                <title>Login | CBT | Grand Regal School</title>
                <meta name="description" content="Login Page to GRS CBT" />
            </Head>
            <section className="flex flex-col items-center justify-center w-screen h-screen overflow-auto p-4 sm:p-6 md:p-8 z-0">
                <div className="w-full h-full absolute inset-0 z-[-1]">
                    <div className="relative w-full h-full">
                        <Image
                            alt="Panda"
                            src={Image1}
                            layout="fill"
                            objectFit="cover"
                        />
                        <div className="absolute z-1 bg-blue-400/60 w-full h-full"></div>
                    </div>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-y-6 sm:gap-y-8 md:gap-y-14 justify-between py-12 px-5 md:px-8 lg:px-12 bg-white rounded-2xl shadow-xl z-0 max-w-full"
                >
                    <h1 className="text-3xl sm:text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span className="sm:text-blue-500">Log in</span>{' '}
                        <span>to your</span>{' '}
                        <span className="text-blue-500">CBT</span>{' '}
                        <span>account</span>
                    </h1>
                    <div className="flex items-center justify-between py-3 sm:px-3 md:px-5 sm:gap-x-4 md:gap-x-6">
                        {code.map((number, pos) => (
                            <Input
                                key={pos}
                                value={number}
                                focus={pos === active}
                                handlePaste={handlePaste}
                                focusPrevious={() => pos !== 0 && focusPrevious(pos)}
                                focusNext={() => pos !== (code.length - 1) && focusNext(pos)}
                                handleChange={val => setCode(code.map((number, i) => pos === i ? val : number))}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className={classNames("flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white", {
                            "bg-blue-400 hover:bg-blue-500 focus:ring-blue-500": success === undefined,
                            "bg-green-400 hover:bg-green-500 focus:ring-green-500": success === true,
                            "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
                        })}
                    >
                        {loading === true && (
                            <LoadingIcon className="animate-spin w-5 h-5" />
                        )}
                        {success === true && (
                            <CheckIcon className="w-5 h-5" />
                        )}
                        {success === false && (
                            <XIcon className="w-5 h-5" />
                        )}
                        Log In
                    </button>
                </form>
            </section>
            <footer className="absolute bottom-5 flex flex-col items-center justify-center text-sm text-gray-300 w-full">
                <span className="tracking-wider text-center min-w-max">
                    <span className="block sm:inline">© 2021 Grand Regal School.</span>{' '}
                    <span className="block sm:inline">All rights reserved.</span>
                </span>
                <Link href="#">
                    <a className="inline-block transition-transform origin-center font-medium tracking-wide text-gray-200 hover:underline">
                        Site by @a.mola
                    </a>
                </Link>
            </footer>
            <abbr
                title={`is ${dbState?.data?.state ?? 'unknown'}`}
                className={classNames("w-3 h-3 fixed top-5 left-5 rounded-full shadow-md ring-2 ring-white transition-colors animate-pulse", {
                    "bg-red-400": dbState?.data?.code === 0,
                    "bg-green-400": dbState?.data?.code === 1,
                    "bg-yellow-400": dbState?.data?.code === 2,
                    "bg-pink-400": dbState?.data?.code === 3,
                    "bg-gray-300": ![0, 1, 2, 3].includes(dbState?.data?.code),
                })}
            ></abbr>
        </>
    )
}

const Input: FunctionComponent<InputProps> = ({ focus, value, focusNext, focusPrevious, handlePaste, handleChange }) => {
    const ref = useRef<HTMLInputElement>(null);

    function onChange(v: string) {
        handleChange(v);
        if (v !== "") focusNext();
    }

    function onKeyDown({ key, target: { value } }: { key: string; target: any }) {
        if (key === "Backspace" && value === "") focusPrevious();
    }

    useEffect(() => {
        if (focus === true) ref.current?.focus();
    });

    function validateCharacter(e: FormEvent<HTMLInputElement> & { data: string; }) {
        if (/\d/.test(e.data) === false) e.preventDefault();
    }

    return (
        <input
            min={0}
            max={9}
            step={1}
            required
            ref={ref}
            pattern="\d+"
            type="number"
            value={value ?? ''}
            inputMode="numeric"
            onKeyDown={onKeyDown}
            onPaste={handlePaste}
            onBeforeInput={validateCharacter}
            onChange={e => onChange(e.target.value.slice(-1))}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 font-bold border rounded-md sm:p-3 md:p-4 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-white"
        />
    );
}

type InputProps = {
    focus: boolean;
    value: string;
    focusNext(): void;
    focusPrevious(): void;
    handleChange(e: string): void;
    handlePaste(e: ClipboardEvent<HTMLInputElement>): void;
}

export default Home;
