import { App } from '@capacitor/app';
import { supabase } from '@/lib/supabaseClient';

export const initDeepLinkHandler = () => {
  // Handle app opened from closed state (cold start)
  App.getLaunchUrl().then(async (data) => {
    if (data?.url) {
      console.log('Cold start deep link:', data.url);

      if (data.url.includes('accessly://auth/callback')) {
        try {
          const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(data.url);

          if (error) {
            console.error('Cold start session exchange failed:', error);
            return;
          }

          console.log('Cold start session established:', sessionData);

          window.location.href = '/';
        } catch (e) {
          console.error('Cold start deep link error:', e);
        }
      }
    }
  });
  App.addListener('appUrlOpen', async (data) => {
    const url = data.url;

    console.log('Deep link received:', url);

    // Handle both code and token based redirects
    if (url.includes('accessly://auth/callback')) {
      try {
        const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.error('Session exchange failed:', error);
          return;
        }

        console.log('Session established:', sessionData);

        // Force navigation after login
        window.location.href = '/';
      } catch (e) {
        console.error('Deep link auth error:', e);
      }
    }
  });
};