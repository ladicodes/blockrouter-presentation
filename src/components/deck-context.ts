"use client";

import { createContext, useContext } from "react";

export type DeckApi = { goTo: (id: string) => void; next: () => void; prev: () => void };

export const DeckContext = createContext<DeckApi>({ goTo: () => {}, next: () => {}, prev: () => {} });

export const useDeck = () => useContext(DeckContext);
