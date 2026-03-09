import { Injectable, computed, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase.client';

interface AuthUser {
  email: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSignal = signal<Session | null>(null);
  private readonly initializedSignal = signal(false);
  private initializePromise: Promise<void> | null = null;

  readonly user = computed<AuthUser | null>(() => {
    const session = this.sessionSignal();
    const authUser = session?.user;
    if (!authUser?.email) return null;

    const displayName =
      typeof authUser.user_metadata['display_name'] === 'string'
        ? authUser.user_metadata['display_name']
        : this.fallbackDisplayName(authUser.email);

    return {
      email: authUser.email,
      displayName,
    };
  });
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isInitialized = computed(() => this.initializedSignal());

  constructor() {
    this.initializePromise = this.initialize();
    supabase.auth.onAuthStateChange((_, session) => {
      this.sessionSignal.set(session);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    if (error) throw error;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async ensureInitialized(): Promise<void> {
    if (this.initializedSignal()) return;
    await this.initializePromise;
  }

  private async initialize(): Promise<void> {
    const { data, error } = await supabase.auth.getSession();
    if (!error) {
      this.sessionSignal.set(data.session);
    }
    this.initializedSignal.set(true);
  }

  private fallbackDisplayName(email: string): string {
    const [namePart] = email.split('@');
    return namePart || 'Blendbook guest';
  }
}
