import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';

declare global {
  namespace App {
    interface Locals {
      hasConsentedToCookies: boolean;
      supabase: SupabaseClient<Database>;
      getSession(): Promise<Session | null>;
    }
    interface PageData {
      hasConsentedToCookies: boolean;
      session: Session | null;
    }
    // interface Error {}
    // interface Platform {}
  }
}