/**
 * useSocket — Socket.io client hook for real-time data streaming.
 * Connects to the API server, subscribes to events, and updates Zustand stores.
 */
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useDataStore } from "@/stores/dataStore";
import type {
  FeedItem,
  CountryRisk,
  DRILevel,
  PipelineStats,
  AIInsight,
  AlertIcon,
} from "@/types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  const addFeedItem = useDataStore((s) => s.addFeedItem);
  const updateCountryRisk = useDataStore((s) => s.updateCountryRisk);
  const setDRILevel = useDataStore((s) => s.setDRILevel);
  const setPipelineStats = useDataStore((s) => s.setPipelineStats);
  const addInsight = useDataStore((s) => s.addInsight);
  const addAlertIcon = useDataStore((s) => s.addAlertIcon);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[WS] Connected:", socket.id);
      // Subscribe to all feed categories
      socket.emit("feed:subscribe", [
        "fraud", "risk", "claims", "geopolitical",
        "regulatory", "weather", "cyber", "market",
      ]);
    });

    socket.on("feed:new", (item: FeedItem) => {
      addFeedItem(item);
    });

    socket.on("risk:update", (risk: CountryRisk) => {
      updateCountryRisk(risk);
    });

    socket.on("dri:change", (level: DRILevel) => {
      setDRILevel(level);
    });

    socket.on("pipeline:stats", (stats: PipelineStats) => {
      setPipelineStats(stats);
    });

    socket.on("insight:new", (insight: AIInsight) => {
      addInsight(insight);
    });

    socket.on("alert:new", (alert: AlertIcon) => {
      addAlertIcon(alert);
    });

    socket.on("disconnect", () => {
      console.log("[WS] Disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addFeedItem, updateCountryRisk, setDRILevel, setPipelineStats, addInsight, addAlertIcon]);

  return socketRef;
}
