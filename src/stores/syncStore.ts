import { create } from 'zustand';

type FileSyncStatus = 'disconnected' | 'connected' | 'saving' | 'error';
type GoogleSyncStatus = 'disconnected' | 'connecting' | 'connected' | 'saving' | 'error';

interface DriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
}

interface DriveFolder {
  id: string;
  name: string;
}

interface SyncConflict {
  local: string;
  remote: string;
  remoteModified: string;
}

interface SyncConfirm {
  message: string;
  onConfirm: () => void;
}

interface SyncDirectionChoice {
  message: string;
  onUpload: () => void;
  onDownload: () => void;
}

interface SyncState {
  // --- File System API ---
  fileHandle: FileSystemFileHandle | null;
  syncStatus: FileSyncStatus;
  lastSyncTime: string | null;

  setFileHandle: (fileHandle: FileSystemFileHandle | null) => void;
  setSyncStatus: (syncStatus: FileSyncStatus) => void;
  setLastSyncTime: (lastSyncTime: string | null) => void;

  // --- Google Drive ---
  googleAccessToken: string | null;
  googleDriveFileId: string | null;
  googleDriveFileName: string | null;
  googleSyncStatus: GoogleSyncStatus;
  googleLastSync: string | null;
  googleDriveFolderId: string | null;
  googleDriveFolderName: string | null;
  syncConflict: SyncConflict | null;
  showFolderChoice: boolean;
  showSyncDirectionChoice: SyncDirectionChoice | null;
  syncSaveFileName: string;
  showSyncConfirm: SyncConfirm | null;
  showSaveDialog: boolean;
  showLoadDialog: boolean;
  driveFiles: DriveFile[];
  driveFolders: DriveFolder[];
  driveLoading: boolean;
  saveFileName: string;
  showFolderPicker: boolean;
  showNewGameDialog: boolean;
  pendingToken: string | null;

  setGoogleAccessToken: (googleAccessToken: string | null) => void;
  setGoogleDriveFileId: (googleDriveFileId: string | null) => void;
  setGoogleDriveFileName: (googleDriveFileName: string | null) => void;
  setGoogleSyncStatus: (googleSyncStatus: GoogleSyncStatus) => void;
  setGoogleLastSync: (googleLastSync: string | null) => void;
  setGoogleDriveFolderId: (googleDriveFolderId: string | null) => void;
  setGoogleDriveFolderName: (googleDriveFolderName: string | null) => void;
  setSyncConflict: (syncConflict: SyncConflict | null) => void;
  setShowFolderChoice: (showFolderChoice: boolean) => void;
  setShowSyncDirectionChoice: (showSyncDirectionChoice: SyncDirectionChoice | null) => void;
  setSyncSaveFileName: (syncSaveFileName: string) => void;
  setShowSyncConfirm: (showSyncConfirm: SyncConfirm | null) => void;
  setShowSaveDialog: (showSaveDialog: boolean) => void;
  setShowLoadDialog: (showLoadDialog: boolean) => void;
  setDriveFiles: (driveFiles: DriveFile[]) => void;
  setDriveFolders: (driveFolders: DriveFolder[]) => void;
  setDriveLoading: (driveLoading: boolean) => void;
  setSaveFileName: (saveFileName: string) => void;
  setShowFolderPicker: (showFolderPicker: boolean) => void;
  setShowNewGameDialog: (showNewGameDialog: boolean) => void;
  setPendingToken: (pendingToken: string | null) => void;

  // --- Disconnect actions ---
  disconnectFile: () => void;
  disconnectGoogleDrive: () => void;
}

// Sync state store — File System API + Google Drive
export const useSyncStore = create<SyncState>((set) => ({
  // --- File System API ---
  fileHandle: null,
  syncStatus: 'disconnected',
  lastSyncTime: null,

  setFileHandle: (fileHandle) => set({ fileHandle }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),

  // --- Google Drive ---
  googleAccessToken: null,
  googleDriveFileId: null,
  googleDriveFileName: null,
  googleSyncStatus: 'disconnected',
  googleLastSync: null,
  googleDriveFolderId: null,
  googleDriveFolderName: null,
  syncConflict: null,
  showFolderChoice: false,
  showSyncDirectionChoice: null,
  syncSaveFileName: 'mausritter-save.json',
  showSyncConfirm: null,
  showSaveDialog: false,
  showLoadDialog: false,
  driveFiles: [],
  driveFolders: [],
  driveLoading: false,
  saveFileName: '',
  showFolderPicker: false,
  showNewGameDialog: false,
  pendingToken: null,

  setGoogleAccessToken: (googleAccessToken) => set({ googleAccessToken }),
  setGoogleDriveFileId: (googleDriveFileId) => set({ googleDriveFileId }),
  setGoogleDriveFileName: (googleDriveFileName) => set({ googleDriveFileName }),
  setGoogleSyncStatus: (googleSyncStatus) => set({ googleSyncStatus }),
  setGoogleLastSync: (googleLastSync) => set({ googleLastSync }),
  setGoogleDriveFolderId: (googleDriveFolderId) => set({ googleDriveFolderId }),
  setGoogleDriveFolderName: (googleDriveFolderName) => set({ googleDriveFolderName }),
  setSyncConflict: (syncConflict) => set({ syncConflict }),
  setShowFolderChoice: (showFolderChoice) => set({ showFolderChoice }),
  setShowSyncDirectionChoice: (showSyncDirectionChoice) => set({ showSyncDirectionChoice }),
  setSyncSaveFileName: (syncSaveFileName) => set({ syncSaveFileName }),
  setShowSyncConfirm: (showSyncConfirm) => set({ showSyncConfirm }),
  setShowSaveDialog: (showSaveDialog) => set({ showSaveDialog }),
  setShowLoadDialog: (showLoadDialog) => set({ showLoadDialog }),
  setDriveFiles: (driveFiles) => set({ driveFiles }),
  setDriveFolders: (driveFolders) => set({ driveFolders }),
  setDriveLoading: (driveLoading) => set({ driveLoading }),
  setSaveFileName: (saveFileName) => set({ saveFileName }),
  setShowFolderPicker: (showFolderPicker) => set({ showFolderPicker }),
  setShowNewGameDialog: (showNewGameDialog) => set({ showNewGameDialog }),
  setPendingToken: (pendingToken) => set({ pendingToken }),

  // --- Disconnect actions ---
  disconnectFile: () => set({
    fileHandle: null,
    syncStatus: 'disconnected',
    lastSyncTime: null,
  }),

  disconnectGoogleDrive: () => set({
    googleAccessToken: null,
    googleDriveFileId: null,
    googleDriveFileName: null,
    googleDriveFolderId: null,
    googleDriveFolderName: null,
    googleSyncStatus: 'disconnected',
    googleLastSync: null,
  }),
}));
