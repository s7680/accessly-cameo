import { App } from '@capacitor/app';
import { supabase } from '@/lib/supabaseClient';

export const initDeepLinkHandler = () => {
  // Handle app opened from closed state (cold start)
  App.getLaunchUrl().then(async (data) => {
    if (data?.url) {
      console.log('Cold start deep link:', data.url);

      if (data.url.includes('accessly://auth/callback')) {
        try {
          if (data.url.includes('#access_token')) {
            const hash = data.url.split('#')[1] || '';
            const params = new URLSearchParams(hash);

            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token && refresh_token) {
              await supabase.auth.setSession({ access_token, refresh_token });
              console.log('Session set from token (cold start)');

              try {
                const { Browser } = await import('@capacitor/browser');
                await Browser.close();
              } catch (e) {
                console.warn('Browser close failed:', e);
              }

              window.location.replace('/');
              return;
            }
          } else {
            const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(data.url);

            if (error) {
              console.error('Cold start session exchange failed:', error);
              return;
            }

            console.log('Cold start session established:', sessionData);

            try {
              const { Browser } = await import('@capacitor/browser');
              await Browser.close();
            } catch (e) {
              console.warn('Browser close failed:', e);
            }

            window.location.replace('/');
          }
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
        if (url.includes('#access_token')) {
          const hash = url.split('#')[1] || '';
          const params = new URLSearchParams(hash);

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
            console.log('Session set from token');

            try {
              const { Browser } = await import('@capacitor/browser');
              await Browser.close();
            } catch (e) {
              console.warn('Browser close failed:', e);
            }

            window.location.replace('/');
            return;
          }
        } else {
          const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(url);

          if (error) {
            console.error('Session exchange failed:', error);
            return;
          }

          console.log('Session established:', sessionData);

          try {
            const { Browser } = await import('@capacitor/browser');
            await Browser.close();
          } catch (e) {
            console.warn('Browser close failed:', e);
          }

          window.location.replace('/');
        }
      } catch (e) {
        console.error('Deep link auth error:', e);
      }
    }
  });
};