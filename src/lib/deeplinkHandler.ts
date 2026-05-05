import { App } from '@capacitor/app';
import { supabase } from '@/lib/supabaseClient';

export const initDeepLinkHandler = () => {
  App.addListener('appUrlOpen', async (data) => {
    const url = data.url;

    if (url.includes('accessly://auth/callback')) {
      await supabase.auth.exchangeCodeForSession(url);
    }
  });
};