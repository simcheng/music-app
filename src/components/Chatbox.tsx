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
import { BASE_URL } from "@/pages";

// type definitions for backend response

interface dateProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
}

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

const Chatbox: React.FC<dateProps> = ({ selectedDate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentName, setCurrentName] = useState<string>("");

  const parse = async (): Promise<Message[]> => {
    const messages: Message[] = [];

    try {
      const response = await axios.get<MessageResponse>(
        `${BASE_URL}/api/messages`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { selectedDate },
        }
      );

      // const jsonResponse = await ; // parse the JSON response
      // Map the messages array to the Messages[] format
      if (!response.data.messages) {
        return [];
      }
      response.data.messages.forEach((messagesData: any) => {
        // ew this leaves the messagesData as any
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
    const fetchedMessages = await parse();
    console.log(fetchedMessages);
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleClick = () => {
    const date = selectedDate.toISOString().split("T")[0];
    handleSendMessage(currentName, currentMessage, date);
    // .then(() => fetchMessages())
  };

  async function handleSendMessage(
    user: string,
    content: string,
    date: string
  ) {
    if (currentMessage.trim() !== "" && currentName.trim() !== "") {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/messages`,
          {
            user,
            content,
            date,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Message posted:", response.data);
      } catch (error) {
        console.error("Failed to post message:", error);
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
        width: "100%",
        maxWidth: "800px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Leave your thoughts here:
      </Typography>

      <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Name"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          sx={{ flex: 1, maxWidth: "100%", marginLeft: "4px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{
            height: "56px",
            fontSize: "1rem",
            padding: "0 24px",
            textTransform: "none",
          }}
        >
          Send
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Message"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        multiline
        rows={4}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleClick();
          }
        }}
        sx={{ marginTop: "8px" }}
      />

      <List
        sx={{
          marginTop: "16px",
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "250px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "8px",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {messages
          .slice(0)
          .reverse()
          .map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                wordWrap: "break-word",
                padding: "8px 16px",
                borderBottom: "1px solid #eee",
                ":last-child": { borderBottom: "none" },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {msg.user}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {msg.content}
                </Typography>
              </Stack>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default Chatbox;
