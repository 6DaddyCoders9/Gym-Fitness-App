import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const BodyPartsList = ({ bodyParts, onSelectBodyParts }) => {
  return (
    <View bodyPartName="px-4 my-1">
      {bodyParts.map((bodyPartItem) => (
        <TouchableOpacity
          key={bodyPartItem.$id}
          onPress={() => onSelectBodyParts(bodyPartItem.$id)}
          className="p-4 mb-4 bg-gray-800 rounded-lg"
        >
          <Image
            source={{ uri: bodyPartItem.thumbnail }}
            style={{ width: 150, height: 150 }}
          />
          <Text className="text-xl text-red-500 pb-2">{bodyPartItem.name}</Text>
          <Text className="text-sm text-gray-100">
            {bodyPartItem.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BodyPartsList;
