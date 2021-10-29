import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { ClassModel } from "db/models";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function getClasses(select: string = ''): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await ClassModel.find({}).select(select);
        [success, status, message] = [true, 200, { data, message: "Success" }];
    } catch (error) {   
        [status, message] = [400, { error, message: "Couldn't GET Classes" }];
    }
    
    return [success, status, message];
}

async function createClass(item: typeof ClassModel.schema.obj): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await ClassModel.create(item);
        [success, status, message] = [true, 201, { data, message: "Created" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't CREATE Class" }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else[success, status, message] = await (method === "POST" ? createClass(JSON.parse(body)) : getClasses(query.select as string));

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
