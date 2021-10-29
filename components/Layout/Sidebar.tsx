import useSWR from "swr";
import { useCookies } from "react-cookie";
import { FunctionComponent, useMemo } from "react";
import { startOfMonth, startOfToday, lastDayOfMonth } from "date-fns";

import { Calendar, Schedule } from "components/Misc";

import { EventRecord } from "types";

const Sidebar: FunctionComponent = () => {
    const date = useMemo(() => new Date(), []);
    const [{ account }] = useCookies(['account']);
    const { data: events } = useSWR(`/api/events?from=${startOfMonth(date).getTime()}&to=${lastDayOfMonth(date).getTime()}`, url => fetch(url).then(res => res.json()));
    const { data: schedule } = useSWR(account !== undefined ? `/api/${account.access.toLowerCase()}s/${account._id}/schedule?date=${startOfToday().getTime()}` : null, url => url !== null && fetch(url).then(res => res.json()));

    return (
        <aside className="flex flex-col flex-shrink-0 gap-8 py-7 px-4 w-80 h-full overflow-y-auto">
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
