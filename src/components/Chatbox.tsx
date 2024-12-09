import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Stack,
} from "@mui/material";
import axios from "axios";

// type definitions for backend response

export type Message = {
  id: number;
  user: string;
  content: string;
  timestamp: string; // Date of the message
};

type MessageResponse = {
  id: number;
  date: string;
  messages: Message[];
};

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentName, setCurrentName] = useState<string>("");

  const parse = async (date: Date): Promise<Message[]> => {
    const messages: Message[] = [];

    try {
      const response = await axios.get<MessageResponse>(
        "https://music-app-simon.vercel.app/api/messages",
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            date,
          },
        }
      );

      // const jsonResponse = await ; // parse the JSON response
      // Map the messages array to the Messages[] format
      if (!response.data.messages) {
        return [];
      }
      response.data.messages.forEach((messagesData: any) => {
        const message: Message = {
          id: messagesData.id,
          user: messagesData.user,
          content: messagesData.content,
          timestamp: messagesData.timestamp, // Date of the message
        };

        messages.push(message);
      });
      console.log(messages);
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  const fetchMessages = async () => {
    const date = new Date();
    const fetchedMessages = await parse(date);
    console.log(fetchedMessages);
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleClick = () => {
    handleSendMessage(currentName, currentMessage);
    // .then(() => fetchMessages())
  };

  async function handleSendMessage(user: string, content: string) {
    if (currentMessage.trim() !== "" && currentName.trim() !== "") {
      try {
        const response = await fetch(
          "https://https://music-app-simon.vercel.app/api/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, content }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to post message");
        }

        const data = await response.json();
        console.log("Message posted:", data);
      } catch (error) {
        console.error(error);
      }

      setCurrentName("");
      setCurrentMessage("");
      fetchMessages();
    }
  }

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "800px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Leave your thoughts here:
      </Typography>

      <Box sx={{ display: "flex", width: "300px", gap: "8px", mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Name"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleClick}>
          Send
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: "8px", mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
      </Box>
      <List sx={{ mt: 1, flexGrow: 1, overflowY: "auto", maxHeight: "200px" }}>
        {messages
          .slice(0)
          .reverse()
          .map((msg, index) => (
            <ListItem key={index} sx={{ wordWrap: "break-word", my: "2" }}>
              <Stack>
                <Typography variant="h6">{msg.user}</Typography>
                <Typography>{msg.content}</Typography>
              </Stack>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default Chatbox;
