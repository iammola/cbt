import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel, ExamModel } from "db/models";

import type { ServerResponse } from "types";
import { EventsGETData, EventsPOSTData } from "types/api/events";

async function createEvent({
  date,
  examId,
}: {
  date: Date;
  examId: string;
}): Promise<ServerResponse<EventsPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<EventsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if ((await ExamModel.exists({ _id: examId })) === false)
      throw new Error("Invalid Exam ID");
    const data = await EventModel.findOneAndUpdate(
      { from: date },
      {
        $addToSet: { exams: examId },
      },
      {
        returnDocument: "after",
        upsert: true,
        lean: true,
        fields: "_id",
        runValidators: true,
      }
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

async function getEvents({
  from,
  to,
  exact,
}: {
  from: string;
  to: string;
  exact?: string;
}): Promise<ServerResponse<EventsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<EventsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await EventModel.find({
      date:
        exact !== undefined
          ? new Date(exact)
          : { $gte: new Date(+from), $lte: new Date(+to) },
    }).lean();
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

export default async function handler(
  { body, query, method }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<
    EventsGETData | EventsPOSTData
  > = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST", "GET"];

  if (allowedMethods.includes(method ?? "") === false) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else
    [success, status, message] = await (method === "POST"
      ? createEvent(JSON.parse(body))
      : getEvents(query as any));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
