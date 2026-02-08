// ============================================
// GLOBAL TYPE DECLARATIONS
// External APIs: Google, GAPI, File System Access
// ============================================

// --- Google Identity Services (accounts.google.com/gsi/client) ---
declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }
      interface TokenResponse {
        access_token: string;
        error?: string;
      }
      interface TokenClient {
        requestAccessToken: (options?: { prompt?: string }) => void;
      }
      function initTokenClient(config: TokenClientConfig): TokenClient;
      function revoke(token: string, callback?: () => void): void;
    }
  }

  namespace picker {
    enum Action {
      PICKED = 'picked',
      CANCEL = 'cancel',
    }
    enum ViewId {
      DOCS = 'docs',
      FOLDERS = 'folders',
    }
    class DocsView {
      constructor(viewId?: ViewId);
      setIncludeFolders(include: boolean): DocsView;
      setMimeTypes(mimeTypes: string): DocsView;
      setSelectFolderEnabled(enabled: boolean): DocsView;
    }
    class PickerBuilder {
      addView(view: DocsView): PickerBuilder;
      setOAuthToken(token: string): PickerBuilder;
      setDeveloperKey(key: string): PickerBuilder;
      setCallback(callback: (data: PickerCallbackData) => void): PickerBuilder;
      build(): Picker;
    }
    interface PickerCallbackData {
      action: string;
      docs?: Array<{ id: string; name: string; mimeType?: string }>;
    }
    interface Picker {
      setVisible(visible: boolean): void;
    }
  }
}

// --- Google API Client (apis.google.com/js/api.js) ---
declare namespace gapi {
  function load(api: string, callback: () => void): void;
  namespace client {
    function init(config: { apiKey: string; discoveryDocs?: string[] }): Promise<void>;
    function setToken(token: { access_token: string } | null): void;
    namespace drive {
      namespace files {
        function list(params: Record<string, any>): Promise<{ result: { files: Array<{ id: string; name: string; modifiedTime?: string; mimeType?: string }> } }>;
        function get(params: Record<string, any>): Promise<{ body: string; result?: any }>;
        function create(params: Record<string, any>): Promise<{ result: { id: string; name: string } }>;
        function update(params: Record<string, any>): Promise<{ result: { id: string; name: string } }>;
      }
    }
    function request(params: Record<string, any>): Promise<any>;
  }
}

// --- File System Access API ---
interface FileSystemFileHandle {
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
  name: string;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string | Blob | ArrayBuffer): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FileSystemFileHandle>;
  showOpenFilePicker?: (options?: {
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
    multiple?: boolean;
  }) => Promise<FileSystemFileHandle[]>;
}
