// Shared TypeScript types for the Google Search Console / Tag Manager integration.

export interface SearchAnalyticsRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SitemapEntry {
  path: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  lastSubmitted?: string;
  lastDownloaded?: string;
  contents?: Array<{ type?: string; submitted?: string; indexed?: string }>;
  warnings?: string;
  errors?: string;
}

export interface UrlInspectionResult {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      lastCrawlTime?: string;
    };
  };
}

export interface GtmTag {
  tagId: string;
  name: string;
  type: string;
  paused?: boolean;
  firingTriggerId?: string[];
}

export interface GtmTrigger {
  triggerId: string;
  name: string;
  type: string;
}

export interface GtmVersionHeader {
  containerVersionId: string;
  name?: string;
  numTags?: string;
  numTriggers?: string;
}

export interface GtmVersion {
  containerVersionId: string;
  name?: string;
  notes?: string;
  fingerprint?: string;
  tag?: GtmTag[];
  trigger?: GtmTrigger[];
}

export interface GoogleConnectionTestResult {
  ok: boolean;
  message: string;
}
