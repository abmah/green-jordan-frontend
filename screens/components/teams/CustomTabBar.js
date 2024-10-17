import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const translateX = useRef(new Animated.Value(0)).current; // Initial translation value
  const [tabWidths, setTabWidths] = useState([]); // Store tab widths
  const [tabPositions, setTabPositions] = useState([]); // Store tab positions

  useEffect(() => {
    // Update the translation value based on the focused tab index
    if (tabWidths.length > 0 && tabPositions.length > 0) {
      Animated.timing(translateX, {
        toValue: tabPositions[state.index], // Move to the position of the focused tab
        duration: 100, // Animation duration
        useNativeDriver: true,
      }).start();
    }
  }, [state.index, tabWidths, tabPositions]);

  const handlePress = (route, isFocused) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  // Handle layout to get widths and positions of tabs
  const handleTabLayout = (index, event) => {
    const { width, x } = event.nativeEvent.layout; // Get width and x position of the tab
    setTabWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width; // Store width
      return newWidths;
    });
    setTabPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = x; // Store position
      return newPositions;
    });
  };

  return (
    <View style={styles.tabBar}>
      <Animated.View
        style={[
          styles.activeBackground,
          {
            transform: [{ translateX }], // Use the animated translateX value
            width: tabWidths[state.index] || 0, // Set width to fit the active tab
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(route, isFocused)}
            style={styles.tabButton}
            onLayout={(event) => handleTabLayout(index, event)} // Capture tab layout
          >
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? "white" : "#B0B0B0" },
              ]}
            >
              {options.tabBarLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#0F1F26",
    borderTopWidth: 0.8,
    borderTopColor: "#ffffff44",
    position: "relative",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  tabLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    fontWeight: "600",
    zIndex: 1,
  },
  activeBackground: {
    position: "absolute",
    top: 15,
    left: 0,
    height: "100%",
    backgroundColor: "#38667A",
    borderRadius: 12,
    paddingVertical: 15,
    zIndex: 0,
  },
});

export default CustomTabBar;
