import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { Message } from "@/components/Chatbox";

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

        // const date = new Date(queryDate); // .toISOString().split("T")[0]

        // const existingMessages = await prisma.dailyChat.findUnique({
        //   where: {
        //     date: queryDate,
        //   },
        //   include: {
        //     messages: true, // Include the messages in the response
        //   },
        // });

        const existingMessages = await prisma.dailyChat.findUnique({
          where: {
            date: queryDate,
          },
          include: {
            messages: true, // Include the messages in the response
          },
        });
        type GroupedMessages = {
          [user: string]: { content: string; timestamp: Date }[];
        };

        // Group messages by user
        const groupedByUser = existingMessages?.messages.reduce(
          (acc: GroupedMessages, message) => {
            if (!acc[message.user]) {
              acc[message.user] = [];
            }
            acc[message.user].push({
              content: message.content,
              timestamp: message.timestamp,
            });
            return acc;
          },
          {}
        ); 

        if (!groupedByUser) {
          throw new Error("Grouped messages is undefined."); 
        }

        // Map results to include all users with a flag for contributors with 3 or more messages
        const result = Object.entries(groupedByUser).map(
          ([user, userMessages]) => ({
            user,
            // contributions: userMessages.length,
            verified: userMessages.length >= 3,
            messages: userMessages,
          })
        );



        // If there are existing messages, return them
        if (existingMessages) {
          return res.status(200).json(existingMessages);
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
          where: { date: queryDate },
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
            timestamp,
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
