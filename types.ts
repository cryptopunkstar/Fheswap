export enum AppTab {
  SIMULATOR = 'simulator',
  GENERATOR = 'generator',
  GUIDE = 'guide'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratedContract {
  code: string;
  explanation: string;
}

export enum SwapStep {
  IDLE = 'idle',
  ENCRYPTING = 'encrypting',
  SUBMITTING = 'submitting',
  PROCESSING = 'processing',
  DECRYPTING = 'decrypting',
  COMPLETED = 'completed'
}

export interface DeploymentStep {
  title: string;
  description: string;
  command?: string;
}
