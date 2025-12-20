import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import TabNavigator from "./TabNavigation";
import NovaTransacaoScreen from "../components/formularios/TransacoesForm";
import ObjetivoForm from "../components/formularios/ObjetivoForm";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs */}
      <Stack.Screen name="Dashboard" component={TabNavigator} />

      {/* Modais / telas fora da tab */}
      <Stack.Screen name="NovaTransacao" component={NovaTransacaoScreen} />
      <Stack.Screen name="ObjetivoForm" component={ObjetivoForm} />
    </Stack.Navigator>
  );
}
