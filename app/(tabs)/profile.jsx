import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { icons } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox.jsx";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [markedDates, setMarkedDates] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const userProgressKeys = keys.filter((key) =>
          key.startsWith(`${user.$id}_`)
        );
        const progress = await AsyncStorage.multiGet(userProgressKeys);

        if (progress.length === 0) {
          setMarkedDates({});
        } else {
          const dates = progress.reduce((acc, [key, value]) => {
            const { date, status } = JSON.parse(value);
            // Only mark the date with a green dot if the status is true
            if (status) {
              acc[date] = {
                marked: true,
                dotColor: "green",
              };
            }
            return acc;
          }, {});
          setMarkedDates(dates);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [user]);

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateProgressHandler = async (date) => {
    try {
      // Determine if the date is currently marked
      const currentlyMarked = markedDates[date]?.marked;
      const newStatus = !currentlyMarked;

      const updatedDates = {
        ...markedDates,
        ...(newStatus
          ? { [date]: { marked: true, dotColor: "green" } }
          : { [date]: { marked: false } }),
      };

      setMarkedDates(updatedDates);

      const key = `${user.$id}_${date}`;
      const progress = { date, status: newStatus };
      if (newStatus) {
        await AsyncStorage.setItem(key, JSON.stringify(progress));

        // Show animation if marking as green
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000); // Hide animation after 3 seconds
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      Alert.alert("Failed to update progress. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={styles.logoutIcon}
              />
            </TouchableOpacity>

            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles={styles.infoBoxContainer}
              titleStyles={styles.infoBoxTitle}
            />
            <Calendar
              markedDates={markedDates}
              onDayPress={(day) => updateProgressHandler(day.dateString)}
              theme={calendarTheme}
            />

            <Text style={styles.infoText}>
              View and update your progress here
            </Text>

            {/* Animation/GIF */}
            {showAnimation && (
              <View style={styles.animationContainer}>
                <Text style={styles.animationText}>
                  Great{"\n"}Workout{"\n"}Today
                </Text>
                <Image
                  style={styles.animation}
                  source={require("../../assets/images/200w.gif")}
                />
                <Text style={styles.animationText}>
                  You{"\n"}Are{"\n"}Stronger
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  logoutButton: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#00adf5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 50,
  },
  infoBoxContainer: {
    marginTop: 5,
  },
  infoBoxTitle: {
    fontSize: 18,
  },
  infoText: {
    color: "#999",
    marginTop: 5,
    marginBottom: 10,
  },
  animationContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#a32020",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 180,
    height: 180,
  },
  animationText: {
    textAlign: "center",
    fontSize: 20,
    color: "#ffd401",
    fontFamily: "Poppins-Bold",
  },
});

const calendarTheme = {
  backgroundColor: "#161622",
  calendarBackground: "#161622",
  textSectionTitleColor: "#fff",
  selectedDayBackgroundColor: "green",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#fff",
  textDisabledColor: "#a0a0a0",
  dotColor: "green",
  selectedDotColor: "#ffffff",
  arrowColor: "orange",
  monthTextColor: "#00adf5",
  indicatorColor: "#00adf5",
  textDayFontFamily: "monospace",
  textMonthFontFamily: "monospace",
  textDayHeaderFontFamily: "monospace",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "300",
  textDayFontSize: 20,
  textMonthFontSize: 40,
  textDayHeaderFontSize: 16,
};

export default Profile;
