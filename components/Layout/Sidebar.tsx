import useSWR from "swr";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FunctionComponent, useMemo } from "react";
import { LogoutIcon } from "@heroicons/react/outline";
import { startOfMonth, startOfToday, lastDayOfMonth } from "date-fns";

import { Calendar, Schedule } from "components/Misc";

import { EventRecord } from "types";

const Sidebar: FunctionComponent = () => {
    const router = useRouter();
    const date = useMemo(() => new Date(), []);
    const [{ account }, , removeCookies] = useCookies(['account']);
    const { data: events } = useSWR(`/api/events?from=${startOfMonth(date).getTime()}&to=${lastDayOfMonth(date).getTime()}`, url => fetch(url).then(res => res.json()));
    const { data: schedule } = useSWR(account !== undefined ? `/api/${account.access.toLowerCase()}s/${account._id}/schedule?date=${startOfToday().getTime()}` : null, url => url !== null && fetch(url).then(res => res.json()));

    return (
        <aside className="flex flex-col flex-shrink-0 gap-8 py-7 px-4 w-full lg:w-80 h-full overflow-y-auto">
            <button
                onClick={() => { removeCookies('account'); setTimeout(router.push, 15e2, '/') }}
                className="flex gap-3 items-center justify-center w-full rounded-md text-white bg-blue-500 hover:bg-blue-600 py-2 px-3 -mt-4"
            >
                <LogoutIcon className="w-5 h-5" />
                Log out
            </button>
            <Calendar
                month={date.getMonth()}
                year={date.getFullYear()}
                events={events?.data?.map(({ date, events }: EventRecord) => ({ date: date.getDate(), count: events.length }))}
            />
            <Schedule
                title="Today"
                schedules={schedule?.data ?? []}
            />
        </aside>
    )
}

export default Sidebar;
