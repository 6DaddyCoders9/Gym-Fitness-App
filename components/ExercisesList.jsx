import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";

const ExercisesList = ({ exercise }) => {
  const handlePress = () => {
    router.push(`/exercises/${exercise.$id}`);
  };

  return (
    <View className="px-4 my-2">
      <View onPress={handlePress} className="p-4 mb-4 bg-white rounded-lg">
        <Image source={{ uri: exercise.thumbnail }} style={styles.thumbnail} />
        <Text className="text-xl text-blue-400">{exercise.name}</Text>
        <Text className="text-lg text-gray-500">{exercise.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
});

export default ExercisesList;
