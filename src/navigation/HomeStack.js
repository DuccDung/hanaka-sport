import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home/HomeScreen";
import RulesScreen from "../screens/Rules/RulesScreen";
import MembersScreen from "../screens/Members/MembersScreen";
import CoachScreen from "../screens/Coach/CoachScreen";
import CoachEditScreen from "../screens/Coach/CoachEditScreen";
import ClubScreen from "../screens/Club/ClubScreen";
import ClubCreateScreen from "../screens/Club/ClubCreateScreen";
import CourtScreen from "../screens/Court/CourtScreen";
import RefereeScreen from "../screens/Referee/RefereeScreen";
import RefereeEditScreen from "../screens/Referee/RefereeEditScreen";
import TournamentScreen from "../screens/Tournament/TournamentScreen";
import ExchangeScreen from "../screens/Exchange/ExchangeScreen";
import MatchListScreen from "../screens/Match/MatchListScreen";
import TournamentDetailScreen from "../screens/Tournament/TournamentDetailScreen";
import RegistrationListScreen from "../screens/Tournament/RegistrationListScreen";
import TournamentScheduleScreen from "../screens/Tournament/TournamentScheduleScreen";
import TournamentStandingsScreen from "../screens/Tournament/TournamentStandingsScreen";
import TournamentStandingsGroupScreen from "../screens/Tournament/TournamentStandingsGroupScreen";
import MemberDetailScreen from "../screens/Members/MemberDetailScreen";
import SelfRatingScreen from "../screens/Members/SelfRatingScreen";
import ClubDetailScreen from "../screens/Club/ClubDetailScreen";
import CoachDetailScreen from "../screens/Coach/CoachDetailScreen";
import CourtDetailScreen from "../screens/Court/CourtDetailScreen";
import RefereeDetailScreen from "../screens/Referee/RefereeDetailScreen";
import TournamentRuleScreen from "../screens/Tournament/TournamentRuleScreen";
import TournamentRegisterScreen from "../screens/Tournament/TournamentRegistrationScreen";
import PairRequestInboxScreen from "../screens/Tournament/PairRequestInboxScreen";
import MyTournamentRegistrationScreen from "../screens/Tournament/MyTournamentRegistrationScreen";
import HanakaRatingInfoScreen from "../screens/Members/HanakaRatingInfoScreen";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Rules"
        component={RulesScreen}
        options={({ navigation }) => ({
          title: "Luật Chơi",
          headerTitleStyle: { fontWeight: "800" },
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 0 }}
            >
              <Ionicons name="chevron-back" size={26} color="#007AFF" />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="Members"
        component={MembersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Coach"
        component={CoachScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CoachEdit"
        component={CoachEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Club"
        component={ClubScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubCreate"
        component={ClubCreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Court"
        component={CourtScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Referee"
        component={RefereeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefereeEdit"
        component={RefereeEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tournament"
        component={TournamentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exchange"
        component={ExchangeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchList"
        component={MatchListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentDetail"
        component={TournamentDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentRegistration"
        component={RegistrationListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentRegister"
        component={TournamentRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PairRequestInbox"
        component={PairRequestInboxScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyTournamentRegistration"
        component={MyTournamentRegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentSchedule"
        component={TournamentScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentStandings"
        component={TournamentStandingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentStandingsGroup"
        component={TournamentStandingsGroupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberDetail"
        component={MemberDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelfRating"
        component={SelfRatingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CoachDetail"
        component={CoachDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourtDetail"
        component={CourtDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefereeDetail"
        component={RefereeDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TournamentRule"
        component={TournamentRuleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HanakaRatingInfo"
        component={HanakaRatingInfoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
