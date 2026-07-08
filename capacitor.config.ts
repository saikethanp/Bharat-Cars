import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bharatcars.app',
  appName: 'Bharat Cars',
  webDir: 'dist',
  server: {
    url: 'https://bharat-cars.vercel.app',
    cleartext: false,
    errorPath: 'offline.html'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: "#050505",
      showSpinner: true,
      spinnerColor: "#C8102E"
    }
  }
};

export default config;
