import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SessionModel } from "db/models";

import type { ClassResultTemplate, ServerResponse } from "types";
import type { ClassResultSettingsGETData, ClassResultSettingsPOSTData } from "types/api/classes";

async function createResultSetting(
  _id: any,
  body: ClassResultTemplate
): Promise<ServerResponse<ClassResultSettingsPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassResultSettingsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const template = await ClassModel.exists({ _id, "resultTemplate.term": body.term });
    const args =
      template === null
        ? [{ $push: { resultTemplate: body } }, { runValidators: true }]
        : [
            {
              "resultTemplate.$[i].scheme": body.scheme,
              "resultTemplate.$[i].fields": body.fields,
            },
            {
              runValidators: true,
              arrayFilters: [{ "i.term": body.term }],
            },
          ];

    const data = await ClassModel.updateOne({ _id }, ...args);

    [success, status, message] = [
      data.acknowledged,
      StatusCodes.OK,
      {
        data: { ok: data.acknowledged },
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

async function getResultSetting({ id, term }: any): Promise<ServerResponse<ClassResultSettingsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassResultSettingsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const classRecord = await ClassModel.findOne(
      {
        _id: id,
        "resultTemplate.terms.term": term,
      },
      "resultTemplate.terms.$"
    ).lean();

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: classRecord?.resultTemplate?.[0],
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

export default async function handler({ body, method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<ClassResultSettingsPOSTData | ClassResultSettingsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "POST"
      ? createResultSetting(query.id, JSON.parse(body))
      : getResultSetting(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
