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
  user: string;
  content: string;
  timestamp: string; // Date of the message
  verified: boolean;
};

type MessageResponse = {
  messages: Message[];
};

const Chatbox: React.FC<dateProps> = ({ selectedDate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentName, setCurrentName] = useState<string>("");

  const parse = async (): Promise<Message[]> => {
    const messages: Message[] = [];

    try {
      const date = selectedDate.toISOString().split("T")[0];
      const response = await axios.get<MessageResponse>(
        `${BASE_URL}/api/messages`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { date },
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
          user: messagesData.user,
          content: messagesData.content,
          timestamp: messagesData.timestamp, // Date of the message
          verified: messagesData.verified,
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
  }, [selectedDate]);

  const handleClick = () => {
    const timestamp = selectedDate.toISOString();
    handleSendMessage(currentName, currentMessage, timestamp).then(() =>
      fetchMessages()
    );
  };

  async function handleSendMessage(
    user: string,
    content: string,
    timestamp: string
  ) {
    if (currentMessage.trim() !== "" && currentName.trim() !== "") {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/messages`,
          {
            user,
            content,
            timestamp,
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
          sx={{ flex: 1, maxWidth: "100%" }}
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
        rows={4}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleClick();
          }
        }}
        sx={{ marginTop: "8px" }}
      />

      {messages.length > 0 && (
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
                <Stack spacing={0.5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {msg.user}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight="text.secondary"
                        paddingLeft="10px"
                      >
                        {msg.timestamp.split("T")[1].slice(0, 5)}
                      </Typography>
                    </>
                    {msg.verified && (
                      <Typography variant="body2" fontWeight="text.secondary">
                        ✔ check!
                      </Typography>
                    )}

                    {/* //   (
                      //   <span
                      //     style={{
                      //       marginLeft: "8px",
                      //       color: "gray",
                      //       fontSize: "14px",
                      //       display: "inline-flex",
                      //       alignItems: "center",
                      //     }}
                      //   >
                      //     ✔
                      //   </span>
                      // ) */}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {msg.content}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
};

export default Chatbox;
