import { createContext, useContext, useEffect, useState } from "react";

let ws;

// Initialize WebSocket
export const initializeWebSocket = (url) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
  return ws;
};

// Send a message via WebSocket
export const sendMessage = (eventType, data) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ eventType, data }));
  } else {
    console.error("WebSocket is not open. Unable to send message.");
  }
};

// Get the WebSocket instance
export const getWebSocket = () => ws;
