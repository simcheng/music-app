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
        queryDate = new Date(req.query.date as string);

        if (!queryDate || Array.isArray(queryDate)) {
          return res
            .status(400)
            .json({ error: "Invalid or missing date parameter" });
        }

        const totalContributions = await prisma.message.groupBy({
          by: ["user"],
          _count: {
            user: true,
          },
        });

        const existingMessages = await prisma.dailyChat.findUnique({
          where: {
            date: queryDate,
          },
          include: {
            messages: true, // Include the messages in the response
          },
        });

        const contributionsMap = totalContributions.reduce(
          (acc, { user, _count }) => {
            acc[user] = _count.user;
            return acc;
          },
          {} as Record<string, number>
        );

        const result = {
          messages: existingMessages?.messages.map((message) => ({
            user: message.user,
            content: message.content,
            timestamp: message.timestamp,
            verified: (contributionsMap[message.user] || 0) >= 3,
          })),
        };

        console.log("API Response:", result);

        // If there are existing messages, return them
        if (result) {
          return res.status(200).json(result);
        }
        return res.status(200).json({});
      } catch (error) {
        console.error("Error fetching or creating messages:", error);
        return res
          .status(500)
          .json({ error: "Failed to fetch or create messages." });
      }
    }

    case "POST": {
      try {
        const { user, content, timestamp } = req.body;

        queryDate = new Date(timestamp);

        let dailyChat = await prisma.dailyChat.findUnique({
          where: {
            date: queryDate,
          },
        });

        if (!dailyChat) {
          dailyChat = await prisma.dailyChat.create({
            data: { date: queryDate },
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
          date: queryDate,
        });
      }
    }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
