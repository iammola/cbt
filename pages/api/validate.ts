import type { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { ResultModel } from "db/models";

import type { ResultRecord } from "types";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  await connect();

  const data = [] as string[];
  const results = await ResultModel.find({}, "data");

  await Promise.all(
    results.map(async (result) => {
      const checked = Object.values(
        result.data.reduce((acc, d) => {
          return {
            ...acc,
            [d.subject.toString()]: d,
          };
        }, {} as Record<string, ResultRecord["data"][number]>)
      );

      if (checked.length !== result.data.length) {
        await result.updateOne({ data: checked });
        data.push(`Result ${result._id.toString()} - From ${result.data.length} To ${checked.length}`);
      }
    })
  );

  res.send(data.join("\n"));
}
