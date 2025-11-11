import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lucksy.lovable',
  appName: 'Lucksy',
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
