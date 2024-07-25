import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getTips } from "../../lib/appwrite"; // Import the actual function for fetching study tips
import EmptyState from "../../components/EmptyState";

const Tips = () => {
  const { user } = useGlobalContext();
  const [tips, setTips] = useState([]);
  const [expandedTip, setExpandedTip] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const tips = await getTips(); // Fetch study tips from your API
        setTips(tips);
      } catch (error) {
        console.error("Error fetching study tips:", error);
        Alert.alert("Error", "Failed to fetch study tips.");
      }
    };
    fetchTips();
  }, []);

  const toggleExpand = (index) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Workout Tips
              </Text>
              <Text className="text-2xl font-psemibold text-secondary">
                Enhance Your Growth
              </Text>
            </View>
          </View>

          {tips.length > 0 ? (
            tips.map((tip, index) => (
              <TouchableOpacity
                key={index}
                className="px-4 py-2 bg-gray-800 rounded-lg shadow-md mb-2"
                onPress={() => toggleExpand(index)}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-blue-400 flex-1">
                    {tip.title}
                  </Text>
                  <Image
                    source={{ uri: tip.thumbnail }}
                    style={{
                      width: 50,
                      height: 50,
                      marginLeft: 10,
                      borderRadius: 8,
                    }}
                  />
                </View>
                <Text className="mt-2 text-gray-100">
                  {expandedTip === index
                    ? tip.content
                    : `${tip.content.slice(0, 10)}...`}
                </Text>
                <Text className="text-blue-400 mt-2">
                  {expandedTip === index ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              title="No Tips Found"
              subtitle="Check back later for more workout tips!"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tips;
