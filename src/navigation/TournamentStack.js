import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TournamentScreen from "../screens/Tournament/TournamentScreen";
import TournamentDetailScreen from "../screens/Tournament/TournamentDetailScreen";
import RegistrationListScreen from "../screens/Tournament/RegistrationListScreen";
import TournamentScheduleScreen from "../screens/Tournament/TournamentScheduleScreen";
import TournamentStandingsScreen from "../screens/Tournament/TournamentStandingsScreen";
import TournamentStandingsGroupScreen from "../screens/Tournament/TournamentStandingsGroupScreen";
import TournamentRuleScreen from "../screens/Tournament/TournamentRuleScreen";
import TournamentRegisterScreen from "../screens/Tournament/TournamentRegisterScreen";
import PartnerSearchScreen from "../screens/Tournament/PartnerSearchScreen";
import PairRequestManagementScreen from "../screens/Tournament/PairRequestManagementScreen";
import PairRequestInboxScreen from "../screens/Tournament/PairRequestInboxScreen";
import PairRequestDetailScreen from "../screens/Tournament/PairRequestDetailScreen";
import MyTournamentRegistrationScreen from "../screens/Tournament/MyTournamentRegistrationScreen";
import MemberDetailScreen from "../screens/Members/MemberDetailScreen";

const Stack = createNativeStackNavigator();

export default function TournamentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TournamentMain" component={TournamentScreen} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
      <Stack.Screen name="TournamentRegistration" component={RegistrationListScreen} />
      <Stack.Screen name="TournamentRegister" component={TournamentRegisterScreen} />
      <Stack.Screen name="PartnerSearch" component={PartnerSearchScreen} />
      <Stack.Screen name="PairRequestManagement" component={PairRequestManagementScreen} />
      <Stack.Screen name="PairRequestDetail" component={PairRequestDetailScreen} />
      <Stack.Screen name="PairRequestInbox" component={PairRequestInboxScreen} />
      <Stack.Screen name="MyTournamentRegistration" component={MyTournamentRegistrationScreen} />
      <Stack.Screen name="TournamentSchedule" component={TournamentScheduleScreen} />
      <Stack.Screen name="TournamentStandings" component={TournamentStandingsScreen} />
      <Stack.Screen name="TournamentStandingsGroup" component={TournamentStandingsGroupScreen} />
      <Stack.Screen name="TournamentRule" component={TournamentRuleScreen} />
      <Stack.Screen name="MemberDetail" component={MemberDetailScreen} />
    </Stack.Navigator>
  );
}
