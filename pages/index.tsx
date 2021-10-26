import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import Image1 from "/public/BG.jpg";

const Home: NextPage = () => {
    const [active, setActive] = useState(0);
    const [code, setCode] = useState<string[]>(Array.from({ length: 6 }));

    const focusPrevious = (index: number) => setActive(--index >= 0 ? index : 0);

    const focusNext = (index: number) => setActive(++index < code.length ? index : 0);

    return (
        <>
            <Head>
                <title>Login | CBT | Grand Regal School</title>
                <meta name="description" content="Login Page to GRS CBT" />
            </Head>
            <section className="flex flex-col items-center justify-center w-screen h-screen p-8 z-0">
                <div className="w-full h-full absolute inset-0 z-[-1]">
                    <div className="relative w-full h-full">
                        <Image
                            alt="Panda"
                            src={Image1}
                            layout="fill"
                            className="object-cover"
                        />
                        <div className="absolute z-1 bg-blue-400/60 w-full h-full"></div>
                    </div>
                </div>
                <form className="flex flex-col gap-y-14 justify-between p-12 bg-white rounded-2xl shadow-xl z-0">
                    <h1 className="text-4xl text-gray-800 font-bold tracking-tight text-center pb-4">
                        <span className="text-blue-500">Log in</span>{' '}
                        <span>to your</span>{' '}
                        <span className="text-blue-500">CBT</span>{' '}
                        <span>account</span>
                    </h1>
                    <div className="flex items-center justify-between py-3 px-5 gap-x-6">
                        {code.map((number, pos, arr) => (
                            <Input
                                key={pos}
                                value={number}
                                focus={pos === active}
                                focusNext={() => focusNext(pos)}
                                focusPrevious={() => focusPrevious(pos)}
                                handleChange={val => setCode(arr.map((number, i) => pos === i ? val : number))}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="flex gap-4 items-center justify-center mt-3 py-2.5 px-3 rounded-md shadow-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white"
                    >
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
        </>
    )
}

const Input: FunctionComponent<InputProps> = ({ focus, value, focusNext, focusPrevious, handleChange }) => {
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
            onBeforeInput={validateCharacter}
            onChange={e => onChange(e.target.value.slice(-1))}
            className="p-4 text-2xl text-gray-700 font-bold border rounded-md w-20 h-20 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-white"
        />
    );
}

type InputProps = {
    focus: boolean;
    value: string;
    focusNext(): void;
    focusPrevious(): void;
    handleChange(e: string): void;
}

export default Home;
