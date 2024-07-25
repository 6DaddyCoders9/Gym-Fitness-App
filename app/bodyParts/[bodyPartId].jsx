import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppwrite from "../../lib/useAppwrite";
import { getExercisesByBodyParts, getItemById } from "../../lib/appwrite"; // Import your function for fetching Exercises and class
import { useRouter, useLocalSearchParams } from "expo-router";
import EmptyState from "../../components/EmptyState";
import ExercisesList from "../../components/ExercisesList"; // Component to render each exercise

const Exercises = () => {
  const router = useRouter();
  const { bodyPartId } = useLocalSearchParams(); // Access query parameters from the router
  const {
    data: exercises,
    refetch,
    isLoading,
  } = useAppwrite(() => getExercisesByBodyParts(bodyPartId)); // Fetch Exercises based on bodyPartId
  const [bodyPartName, setBodyPartName] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load body part name from AsyncStorage or fetch it from the server
    const loadBodyPartName = async () => {
      try {
        // Fetch body part name from server
        const bodyPartData = await getItemById(bodyPartId); // Function to get body part data by ID
        setBodyPartName(bodyPartData.name);
        // Store body part name in AsyncStorage
        await AsyncStorage.setItem("selectedBodyPartName", bodyPartData.name);
      } catch (error) {
        console.error("Failed to load body part name", error);
      }
    };

    loadBodyPartName();
  }, [bodyPartId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Selected Body Part:
            </Text>
            <Text className="text-2xl font-psemibold text-orange-500">
              {bodyPartName || "Loading..."}
            </Text>
          </View>
        </View>
        <Text className="text-xl font-psemibold text-white">Exercises</Text>
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Exercises Found"
            subtitle="There are no exercises available for this body part at the moment."
          />
        )}
        renderItem={({ item }) => <ExercisesList exercise={item} />}
        ListFooterComponent={
          isLoading ? (
            <Text className="text-white pt-20 mx-5">Loading...</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Exercises;
