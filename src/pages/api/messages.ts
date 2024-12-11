import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  let queryDate: Date = new Date();

  switch (method) {
    case "GET": {
      try {
        // check existing selected date passed in query for validity
        queryDate = new Date(req.query.q as string);

        if (!queryDate || Array.isArray(queryDate)) {
          return res
            .status(400)
            .json({ error: "Invalid or missing date parameter" });
        }

        const date = new Date(queryDate.toISOString().split("T")[0]);

        const existingMessages = await prisma.dailyChat.findFirst({
          where: {
            date: date,
          },
          include: {
            messages: true, // Include the messages in the response
          },
        });

        // If there are existing daily songs, return them
        if (existingMessages) {
          return res.status(200).json(existingMessages);
        }
        return res.status(200).json({});
      } catch (error) {
        console.error("Error fetching or creating daily songs:", error);
        return res
          .status(500)
          .json({ error: "Failed to fetch or create daily songs." });
      }
    }

    case "POST": {
      try {
        const { user, content } = req.body;
        const date = new Date().toISOString().split("T")[0];

        let dailyChat = await prisma.dailyChat.findUnique({
          where: { date: date },
        });

        if (!dailyChat) {
          dailyChat = await prisma.dailyChat.create({
            data: { date: date },
          });
        }

        const newMessage = await prisma.message.create({
          data: {
            user,
            content,
            dailyChatId: dailyChat.id,
          },
        });
        return res.status(201).json(newMessage);
      } catch (error: any) {
        console.error("Error posting message:", error);

        // Use a fallback message if error.message is not defined
        return res.status(500).json({
          error: error.message || "Internal Server Error",
          details: error, // Optionally include the full error object
        });
      }
    }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
