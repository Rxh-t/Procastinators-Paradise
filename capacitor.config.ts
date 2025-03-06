
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.27621637fa6e41cd9662e831b395cc84',
  appName: 'Procrastinators Paradise',
  webDir: 'dist',
  server: {
    url: 'https://27621637-fa6e-41cd-9662-e831b395cc84.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f4f4f4",
      androidSplashResourceName: "splash",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: "AAB"
    }
  }
};

export default config;
