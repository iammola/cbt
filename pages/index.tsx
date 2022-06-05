import useSWR from "swr";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { addHours } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { BadgeCheckIcon, BanIcon, StatusOfflineIcon, StatusOnlineIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useRef, useState } from "react";

import { classNames } from "utils";
import Background from "/public/BG.jpg";
import { LoadingIcon } from "components/Misc/Icons";
import { useNotifications } from "components/Misc/Notification";

import type { ClientResponse, RouteData } from "types";
import type { LoginData, PingData } from "types/api";

const Home: NextPage = () => {
  const router = useRouter();
  const [, setCookies, removeCookies] = useCookies(["account", "exam", "timeBounds"]);
  const [addNotification, removeNotification, Notifications] = useNotifications();
  const { data: dbState } = useSWR<RouteData<PingData>>("/api/ping/", (url) => fetch(url).then((res) => res.json()));

  const [active, setActive] = useState(0);
  const [code, setCode] = useState<string[]>(Array.from({ length: 6 }));

  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState({ o: true, i: -1 });
  const [success, setSuccess] = useState<boolean | undefined>();

  const focusPrevious = (index: number) => setActive(--index >= 0 ? index : 0);

  const focusNext = (index: number) => setActive(++index < code.length ? index : 0);

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");

    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(""));
      setActive(5);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        body: JSON.stringify({ code: +code.join("") }),
      });
      const result = (await res.json()) as ClientResponse<LoginData>;

      setSuccess(result.success);
      if (result.success) {
        removeCookies("exam", { path: "/" });
        removeCookies("timeBounds", { path: "/" });
        setTimeout(
          router.push,
          55e1,
          router.query.to === undefined ? "/home" : decodeURIComponent(router.query.to as string)
        );
        setCookies("account", JSON.stringify(result.data), {
          path: "/",
          sameSite: true,
          expires: addHours(new Date(), 7),
        });
        addNotification({
          message: "Success 👍 ...  Redirecting!! 🚀",
          timeout: 10e3,
          Icon: () => <BadgeCheckIcon className="h-6 w-6 stroke-emerald-600" />,
        });
      } else throw new Error(result.error);
    } catch (error: any) {
      setActive(0);
      setCode(Array.from({ length: 6 }));
      if (!navigator.onLine) setTimeout(handleOnline, 1e3);
      addNotification({
        message: "Wrong 🙅‍♂️ ... Try again!! 🧨",
        timeout: 5e3,
        Icon: () => <BanIcon className="h-6 w-6 stroke-red-600" />,
      });
      console.error({ error });
    }

    setLoading(false);
    setTimeout(setSuccess, 5e2, undefined);
  }

  const handleOnline = useCallback(() => {
    let lastId = online.i;

    if (!online.o && navigator.onLine)
      lastId = addNotification({
        message: "Back Online. 💯",
        timeout: 75e2,
        Icon: () => <StatusOnlineIcon className="h-6 w-6 stroke-blue-600" />,
      })[0];

    if (online.o && !navigator.onLine)
      lastId = addNotification({
        message: "Offline!! Its that bad huh? 🤷‍♂️",
        timeout: 15e3,
        Icon: () => <StatusOfflineIcon className="h-6 w-6 stroke-red-600" />,
      })[0];

    if (lastId !== -1) {
      if (online.i !== -1 && online.o !== navigator.onLine) removeNotification(online.i);
      setOnline({ i: lastId, o: navigator.onLine });
    }
  }, [addNotification, online, removeNotification]);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOnline);
    };
  }, [handleOnline]);

  return (
    <>
      <Head>
        <title>Login | CBT | Grand Regal School</title>
        <meta
          name="description"
          content="Login Page to GRS CBT"
        />
      </Head>
      <section className="z-0 flex h-screen w-screen flex-col items-center justify-center overflow-auto p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 z-[-1] h-full w-full">
          <div className="relative h-full w-full">
            <Image
              layout="fill"
              alt="The Scenes"
              src={Background}
              objectFit="cover"
              placeholder="blur"
              objectPosition="center"
            />
            <div className="z-1 absolute h-full w-full bg-blue-400/50"></div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="z-0 flex max-w-full flex-col justify-between gap-y-6 rounded-2xl bg-white py-12 px-5 shadow-xl sm:gap-y-8 md:gap-y-14 md:px-8 lg:px-12"
        >
          <h1 className="pb-4 text-center text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            <span className="sm:text-blue-500">Log in</span> <span>to your</span>{" "}
            <span className="text-blue-500">CBT</span> <span>account</span>
          </h1>
          <div className="flex items-center justify-between py-3 sm:gap-x-4 sm:px-3 md:gap-x-6 md:px-5">
            {code.map((number, pos) => (
              <Input
                key={pos}
                value={number}
                focus={pos === active}
                handlePaste={handlePaste}
                focusPrevious={() => pos !== 0 && focusPrevious(pos)}
                focusNext={() => pos !== code.length - 1 && focusNext(pos)}
                handleChange={(val) => setCode(code.map((number, i) => (pos === i ? val : number)))}
              />
            ))}
          </div>
          <button
            type="submit"
            className={classNames(
              "mt-3 flex items-center justify-center gap-4 rounded-md py-2.5 px-3 text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-offset-white",
              {
                "bg-blue-400 hover:bg-blue-500 focus:ring-blue-500": success === undefined,
                "bg-emerald-400 hover:bg-emerald-500 focus:ring-emerald-500": success,
                "bg-red-400 hover:bg-red-500 focus:ring-red-500": success === false,
              }
            )}
          >
            {loading && <LoadingIcon className="h-5 w-5 animate-spin stroke-white" />}
            {success && <CheckIcon className="h-5 w-5 fill-white" />}
            {success === false && <XIcon className="h-5 w-5 fill-white" />}
            Log In
          </button>
        </form>
      </section>
      <footer className="absolute bottom-5 flex w-full flex-col items-center justify-center text-sm text-gray-300">
        <span className="min-w-max text-center tracking-wider">
          <span className="block sm:inline">© {new Date().getFullYear()} Grand Regal School.</span>{" "}
          <span className="block sm:inline">All rights reserved.</span>
        </span>
        <Link href="https://github.com/iammola/">
          <a className="inline-block origin-center font-medium tracking-wide text-gray-200 transition-transform hover:underline">
            Site by @a.mola
          </a>
        </Link>
      </footer>
      <abbr
        title={`is ${dbState?.data?.state ?? "unknown"}`}
        className={classNames("fixed top-5 left-5 h-3 w-3 rounded-full shadow-md ring-2 ring-white transition-colors", {
          "bg-red-400": dbState?.data?.code === 0,
          "bg-emerald-400": dbState?.data?.code === 1,
          "bg-amber-400": dbState?.data?.code === 2,
          "bg-pink-400": dbState?.data?.code === 3,
          "bg-gray-300": ![0, 1, 2, 3].includes(dbState?.data?.code ?? -1),
        })}
      />
      {Notifications}
    </>
  );
};

const Input: React.FC<InputProps> = ({ focus, value, focusNext, focusPrevious, handlePaste, handleChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  function onChange(v: string) {
    handleChange(v);
    if (v !== "") focusNext();
  }

  function onKeyDown({ key, target: { value } }: { key: string; target: any }) {
    if (key === "Backspace" && value === "") focusPrevious();
  }

  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);

  function validateCharacter(e: React.FormEvent<HTMLInputElement> & { data: string }) {
    if (!/\d/.test(e.data)) e.preventDefault();
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
      value={value ?? ""}
      inputMode="numeric"
      onKeyDown={onKeyDown}
      onPaste={handlePaste}
      onBeforeInput={validateCharacter}
      onChange={(e) => onChange(e.target.value.slice(-1))}
      className="h-10 w-10 rounded-md border text-center text-lg font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white sm:h-16 sm:w-16 sm:p-3 sm:text-xl md:h-20 md:w-20 md:p-4 md:text-2xl"
    />
  );
};

type InputProps = {
  focus: boolean;
  value: string;
  focusNext(): void;
  focusPrevious(): void;
  handleChange(e: string): void;
  handlePaste(e: React.ClipboardEvent<HTMLInputElement>): void;
};

export default Home;
