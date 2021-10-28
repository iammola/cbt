import useSWR from "swr";
import { FunctionComponent, useMemo } from "react";
import { startOfMonth, lastDayOfMonth } from "date-fns";

import { EventRecord } from "db/models/Event";
import { Calendar, Schedule } from "components/Misc";

const Sidebar: FunctionComponent = () => {
    const date = useMemo(() => new Date(), []);
    const { data: events } = useSWR(`/api/events?from=${startOfMonth(date).getTime()}&to=${lastDayOfMonth(date).getTime()}`, url => fetch(url).then(res => res.json()));

    return (
        <aside className="flex flex-col flex-shrink-0 gap-8 py-7 px-4 w-80 h-full overflow-y-auto">
            <Calendar
                month={date.getMonth()}
                year={date.getFullYear()}
                events={events?.data?.map(({ date, events }: EventRecord) => ({ date: date.getDate(), count: events.length }))}
            />
            <Schedule
                title="Today"
                schedules={[{
                    name: "Physics",
                    time: 3600000,
                    questions: 50
                }, {
                    name: "Mathematics",
                    time: 7200000,
                    questions: 100
                }]}
            />
        </aside>
    )
}

export default Sidebar;
