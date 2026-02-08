import { create } from 'zustand';
import type { Character } from '../types';

interface PendingMention {
  type: 'npc' | 'settlement';
  id: string;
}

interface UIState {
  activePanel: string;
  mobileMenuOpen: boolean;
  pendingMentionOpen: PendingMention | null;
  sidePanelCharacter: Character | null;

  setActivePanel: (activePanel: string) => void;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  setPendingMentionOpen: (pendingMentionOpen: PendingMention | null) => void;
  setSidePanelCharacter: (sidePanelCharacter: Character | null) => void;
  toggleMobileMenu: () => void;
}

// UI state store — transient state (active panel, mobile menu, side panel)
export const useUIStore = create<UIState>((set) => ({
  activePanel: 'journal',
  mobileMenuOpen: false,
  pendingMentionOpen: null,
  sidePanelCharacter: null,

  setActivePanel: (activePanel) => set({ activePanel, mobileMenuOpen: false }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setPendingMentionOpen: (pendingMentionOpen) => set({ pendingMentionOpen }),
  setSidePanelCharacter: (sidePanelCharacter) => set({ sidePanelCharacter }),
  toggleMobileMenu: () => set(s => ({ mobileMenuOpen: !s.mobileMenuOpen })),
}));
