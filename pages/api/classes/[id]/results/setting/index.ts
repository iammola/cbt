import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SessionModel } from "db/models";

import type { ClassResultTemplate, ServerResponse } from "types";
import type { ClassResultSettingsGETData, ClassResultSettingsPOSTData } from "types/api/classes";

async function createResultSetting(_id: any, body: Omit<ClassResultTemplate, 'term'>): Promise<ServerResponse<ClassResultSettingsPOSTData>> {
    await connect();
    let [success, status, message]: ServerResponse<ClassResultSettingsPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const classRecord = await ClassModel.findById(_id, 'resultTemplate').lean();
        if (classRecord === null) throw new Error("Class does not exist");

        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms._id.$').lean();
        if (currentSession === null) throw new Error("No session to bind to");

        const data = await ClassModel.updateOne({ _id }, {
            resultTemplate: [{
                session: currentSession._id,
                terms: [{
                    fields: body.fields,
                    scheme: body.scheme,
                    term: currentSession.terms[0]._id,
                }]
            }]
        }, { runValidators: true });

        [success, status, message] = [data.acknowledged, StatusCodes.OK, {
            data: { ok: data.acknowledged },
            message: ReasonPhrases.OK
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

async function getResultSetting(_id: any): Promise<ServerResponse<ClassResultSettingsGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<ClassResultSettingsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms._id.$').lean();
        const classRecord = await ClassModel.findOne({
            _id,
            resultTemplate: {
                $elemMatch: {
                    session: currentSession?._id,
                    "terms.term": currentSession?.terms[0]._id,
                }
            },
        }, 'resultTemplate.terms.$').lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: classRecord?.resultTemplate?.[0]?.terms?.[0],
            message: ReasonPhrases.OK
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ body, method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<ClassResultSettingsPOSTData | ClassResultSettingsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createResultSetting(query.id, JSON.parse(body)) : getResultSetting(query.id));

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
