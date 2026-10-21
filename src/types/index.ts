export type ScenarioId = 'intro' | 'reuse' | 'repair' | 'component' | 'recycle' | 'closing';

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  imageUrl?: string;
  statusBadge?: {
    label: string;
    variant: 'reuse' | 'repair' | 'component' | 'recycle' | 'info';
  };
  valuation?: {
    currency: string;
    amount: string;
    condition: string;
    co2Saved: string;
    payoutTime: string;
  };
  actionButtons?: {
    label: string;
    icon?: string;
    primary?: boolean;
    actionKey?: string;
  }[];
  delayMs: number;
}

export interface ChatBubbleItem {
  id: string;
  bubbleIndex: number;
  scenarioId: ScenarioId;
  scenarioTitle: string;
  category: 'Overview' | 'Reuse' | 'Repair' | 'Component Recovery' | 'Recycling' | 'Impact';
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  activeN8nNodeId: string;
  narrationText: string;
  keyTakeaway: string;
  carbonOffsetKg?: number;
  economicValueIdr?: number;
  statusBadge?: {
    label: string;
    variant: 'reuse' | 'repair' | 'component' | 'recycle' | 'info';
  };
  valuation?: {
    currency: string;
    amount: string;
    condition: string;
    co2Saved: string;
    payoutTime: string;
  };
  actionButtons?: {
    label: string;
    primary?: boolean;
    actionKey?: string;
  }[];
}

export interface N8nNodeState {
  id: string;
  label: string;
  type: 'trigger' | 'ai' | 'router' | 'valuation' | 'db' | 'telegram';
  description: string;
  executionTime?: string;
}

export interface ScenarioStep {
  id: ScenarioId;
  title: string;
  subtitle: string;
  durationSeconds: number;
  category: 'Overview' | 'Reuse' | 'Repair' | 'Component Recovery' | 'Recycling' | 'Impact';
  devicePhoto: string;
  deviceTitle: string;
  conditionDesc: string;
  narrationId: string;
  narrationEn: string;
  activeN8nNodeId: string;
  messages: TelegramMessage[];
  keyTakeaway: string;
  circularAction: string;
  carbonOffsetKg?: number;
  economicValueIdr?: number;
}

export interface EditableVideoContent {
  brandName: string;
  tagline: string;
  teamCredit: string;
  
  // Phase 1: Intro
  introBadge: string;
  introHeadline1: string;
  introHeadline2: string;
  introSubtitle: string;
  introVoiceover: string;

  // Phase 2: Workflow
  workflowTitle: string;
  workflowSubtitle: string;
  workflowVoiceover: string;

  // Phase 3: Bubbles (exact 4 circular scenarios)
  bubbles: {
    id: string;
    scenarioTitle: string;
    category: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
    narrationText: string;
    keyTakeaway: string;
  }[];

  // Phase 4: Orbit Ecosystem
  orbitTitle1: string;
  orbitTitle2: string;
  orbitSubtitle: string;
  orbitVoiceover: string;

  // Phase 5: Closing
  closingBadge: string;
  closingHeadline1: string;
  closingHeadline2: string;
  closingSubtitle: string;
  closingVoiceover: string;
}
