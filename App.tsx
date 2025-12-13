import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigation";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import TabNavigator from "./src/navigation/TabNavigation";
import NovaTransacaoScreen from "./src/components/formularios/TransacoesForm";
import ObjetivoForm from "./src/components/formularios/ObjetivoForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Fluxo inicial */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* App logado (todas as telas com barra inferior) */}
        <Stack.Screen name="Dashboard" component={TabNavigator} />

        <Stack.Screen name="NovaTransacao" component={NovaTransacaoScreen} />
        <Stack.Screen name="ObjetivoForm" component={ObjetivoForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
