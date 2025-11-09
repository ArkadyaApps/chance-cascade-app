import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lucksy.lovable',
  appName: 'Lucksy',
  webDir: 'build',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-3486145054830108~3206188816',
      testingDevices: ['YOUR_DEVICE_ID'],
    },
  },
};

export default config;
