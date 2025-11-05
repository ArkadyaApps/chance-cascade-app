import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d7d9a4b724fa42ec93a318df0dd5f545',
  appName: 'chance-cascade-app',
  webDir: 'dist',
  server: {
    url: 'https://d7d9a4b7-24fa-42ec-93a3-18df0dd5f545.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-3486145054830108~3206188816',
      testingDevices: ['YOUR_DEVICE_ID'],
    },
  },
};

export default config;
