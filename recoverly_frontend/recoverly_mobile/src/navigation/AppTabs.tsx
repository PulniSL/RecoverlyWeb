import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/main/HomeScreen";
import CheckInScreen from "../screens/main/CheckInScreen";
// import SocialScreen from "../screens/main/SocialScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ title: "Check-In" }}
      />

      {/* <Tab.Screen
        name="Social"
        component={SocialScreen}
        options={{ title: "Social" }}
      /> */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      /> 
    </Tab.Navigator>
  );
}
