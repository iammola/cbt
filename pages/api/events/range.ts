import { format } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel, SubjectsModel } from "db/models";

import type { EventsRangeGETData } from "types/api/events";
import type { EventRecord, ServerResponse, SubjectsRecord } from "types";

async function getEventsRange(from: any, to: any): Promise<ServerResponse<EventsRangeGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<EventsRangeGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const events: EventRecord<true>[] = await EventModel.find(
      {
        from: {
          $lte: new Date(+to),
          $gte: new Date(+from),
        },
      },
      "from exams"
    )
      .populate("exams", "subjectId")
      .lean();

    const data = await Promise.all(
      events.map(async ({ from, exams }) => ({
        date: new Date(from),
        time: format(new Date(from), "h:mm a"),
        events: (
          await Promise.all(
            exams.map(async ({ subjectId }) => {
              const record: SubjectsRecord<true> | null = await SubjectsModel.findOne(
                {
                  "subjects._id": subjectId,
                },
                "class subjects.name.$"
              )
                .populate("class", "alias")
                .lean();

              return record === null ? "" : `${record.class.alias} ${record.subjects[0].name}`;
            })
          )
        ).filter(Boolean),
      }))
    );

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data,
        message: ReasonPhrases.OK,
      },
    ];
  } catch (error: any) {
    [status, message] = [
      StatusCodes.BAD_REQUEST,
      {
        error: error.message,
        message: ReasonPhrases.BAD_REQUEST,
      },
    ];
  }

  return [success, status, message];
}

export default async function handler({ query, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<EventsRangeGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getEventsRange(query.from, query.to);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
