// App.js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUserIdStore from "./stores/useUserStore";
import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StatusBar, View, Text, TextInput } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import toastConfig from "./utils/toastConfig";
import i18n from "./utils/i18n";
import { I18nextProvider } from "react-i18next";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const { userId } = useUserIdStore();
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-ExtraBold": require("./assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
    "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
    "Nunito-ExtraLight": require("./assets/fonts/Nunito-ExtraLight.ttf"),
    "NotoSansArabic-Regular": require("./assets/fonts/NotoSansArabic-Regular.ttf"),
    "NotoSansArabic-Bold": require("./assets/fonts/NotoSansArabic-Bold.ttf"),
    "NotoSansArabic-SemiBold": require("./assets/fonts/NotoSansArabic-SemiBold.ttf"),
    "NotoSansArabic-Medium": require("./assets/fonts/NotoSansArabic-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Set default styles for Text and TextInput
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.style = { fontFamily: "Nunito-Regular" };

  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.style = { fontFamily: "Nunito-Regular" };

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0F1F26"
          translucent={true}
        />
        <NavigationContainer>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <BottomTabNavigator />
          </View>
          <Toast ref={Toast.setRef} config={toastConfig} />
        </NavigationContainer>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
