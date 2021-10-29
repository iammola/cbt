import { NextApiRequest, NextApiResponse } from "next";

import { RouteResponse } from "types";

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
