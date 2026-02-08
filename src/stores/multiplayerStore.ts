import { create } from 'zustand';

type MultiplayerStatus = 'disconnected' | 'connecting' | 'connected';
type ToastType = 'info' | 'success' | 'error';

interface MultiplayerToast {
  message: string;
  type: ToastType;
}

interface RoomPlayer {
  id: string;
  name: string;
  isGM?: boolean;
}

interface MultiplayerState {
  roomCode: string | null;
  roomName: string | null;
  roomConnected: boolean;
  roomPlayers: RoomPlayer[];
  isGM: boolean;
  myUserId: string | null;
  multiplayerStatus: MultiplayerStatus;
  showCreateRoomDialog: boolean;
  showJoinRoomDialog: boolean;
  showRoomCreatedDialog: boolean;
  showPlayersDialog: boolean;
  currentGmPin: string | null;
  multiplayerToast: MultiplayerToast | null;

  setRoomCode: (roomCode: string | null) => void;
  setRoomName: (roomName: string | null) => void;
  setRoomConnected: (roomConnected: boolean) => void;
  setRoomPlayers: (roomPlayers: RoomPlayer[]) => void;
  setIsGM: (isGM: boolean) => void;
  setMyUserId: (myUserId: string | null) => void;
  setMultiplayerStatus: (multiplayerStatus: MultiplayerStatus) => void;
  setShowCreateRoomDialog: (showCreateRoomDialog: boolean) => void;
  setShowJoinRoomDialog: (showJoinRoomDialog: boolean) => void;
  setShowRoomCreatedDialog: (showRoomCreatedDialog: boolean) => void;
  setShowPlayersDialog: (showPlayersDialog: boolean) => void;
  setCurrentGmPin: (currentGmPin: string | null) => void;
  setMultiplayerToast: (multiplayerToast: MultiplayerToast | null) => void;

  showToast: (message: string, type?: ToastType) => void;
  leaveRoom: () => void;
}

// Multiplayer state store — Firebase Realtime Database
export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  roomCode: null,
  roomName: null,
  roomConnected: false,
  roomPlayers: [],
  isGM: false,
  myUserId: null,
  multiplayerStatus: 'disconnected',
  showCreateRoomDialog: false,
  showJoinRoomDialog: false,
  showRoomCreatedDialog: false,
  showPlayersDialog: false,
  currentGmPin: null,
  multiplayerToast: null,

  setRoomCode: (roomCode) => set({ roomCode }),
  setRoomName: (roomName) => set({ roomName }),
  setRoomConnected: (roomConnected) => set({ roomConnected }),
  setRoomPlayers: (roomPlayers) => set({ roomPlayers }),
  setIsGM: (isGM) => set({ isGM }),
  setMyUserId: (myUserId) => set({ myUserId }),
  setMultiplayerStatus: (multiplayerStatus) => set({ multiplayerStatus }),
  setShowCreateRoomDialog: (showCreateRoomDialog) => set({ showCreateRoomDialog }),
  setShowJoinRoomDialog: (showJoinRoomDialog) => set({ showJoinRoomDialog }),
  setShowRoomCreatedDialog: (showRoomCreatedDialog) => set({ showRoomCreatedDialog }),
  setShowPlayersDialog: (showPlayersDialog) => set({ showPlayersDialog }),
  setCurrentGmPin: (currentGmPin) => set({ currentGmPin }),
  setMultiplayerToast: (multiplayerToast) => set({ multiplayerToast }),

  // --- Actions ---
  showToast: (message, type = 'info') => {
    set({ multiplayerToast: { message, type } });
    setTimeout(() => set({ multiplayerToast: null }), 3000);
  },

  leaveRoom: () => set({
    roomCode: null,
    roomName: null,
    roomConnected: false,
    roomPlayers: [],
    isGM: false,
    multiplayerStatus: 'disconnected',
  }),
}));
