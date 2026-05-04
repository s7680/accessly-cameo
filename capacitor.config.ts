import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.accessly.app',
  appName: 'Accessly',
  webDir: 'out', // keep it, but not used when server.url is present

  server: {
    url: 'https://accessly-cameo.vercel.app/',
    cleartext: true
  }
};

export default config;