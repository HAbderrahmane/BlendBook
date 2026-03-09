import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

export const supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
