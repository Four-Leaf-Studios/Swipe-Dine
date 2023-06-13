import {
  Animated,
  Image,
  Linking,
  PanResponder,
  Pressable,
  StyleSheet,
  useAnimatedValue,
  useWindowDimensions,
} from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import SwipeCardButton from "./SwipeCardButton";
import LinearGradient from "./LinearGradient";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

interface Props {
  handleSwipe: (direction: string, place_id: string) => void;
  restaurantPassed?: RestaurantDetails;
  discover?: boolean;
  filters: Object;
  navigation: any;
}

const SwipeCard = memo(
  ({
    restaurantPassed,
    handleSwipe,
    discover: discoverPassed = false,
    filters,
  }: Props) => {
    const theme = useTheme<Theme>();
    const { orangeDark } = theme.colors;
    const [discover, setDiscover] = useState(discoverPassed);
    const { restaurant: restaurantDetails, loading } = useRestaurantDetails(
      restaurantPassed?.place_id,
      discover,
      filters
    );
    const [restaurant, setRestaurant] = useState(restaurantPassed);
    useEffect(() => {
      if (
        restaurantDetails &&
        JSON.stringify(restaurant) !== JSON.stringify(restaurantDetails)
      )
        setRestaurant(restaurantDetails);
    }, [restaurantDetails]);

    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [pan] = useState(new Animated.ValueXY());
    const cardOpacity = useAnimatedValue(1);
    const indicators = useAnimatedValue(0);
    const [rotate, setRotate] = useState("0 deg");
    const windowWidth = useWindowDimensions().width;
    const handleSwipeLeft = () => {
      setRotate("-20 deg");

      Animated.timing(pan, {
        toValue: { x: -windowWidth - 150, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }).start(() => handleSwipe("left", restaurant.place_id));
    };
    const handleViewDetails = () => {};
    const handleSwipeRight = () => {
      Animated.timing(pan, {
        toValue: { x: windowWidth + 150, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }).start(() => handleSwipe("right", restaurant.place_id));
      setRotate("20 deg");
    };

    const handlePanResponderMove = (_, gesture) => {
      pan.setValue({ x: gesture.dx, y: 0 });
    };

    const handlePanResponderGrant = () => {
      Animated.timing(indicators, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    };

    const handlePanResponderTerminate = () => {
      Animated.timing(indicators, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };

    const handlePanResponderRelease = (_, gesture) => {
      Animated.timing(indicators, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      if (gesture.dx > 120) {
        Animated.timing(pan, {
          toValue: { x: 500, y: 0 },
          useNativeDriver: false,
        }).start(() => handleSwipe("right", restaurant.place_id));
      } else if (gesture.dx < -120) {
        Animated.timing(pan, {
          toValue: { x: -500, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => handleSwipe("left", restaurant.place_id));
      } else {
        setRotate("0 deg");

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderRelease,
      onPanResponderTerminate: handlePanResponderTerminate,
    });

    const cardStyle = {
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        {
          rotate: rotate,
        },
      ],
      opacity: cardOpacity,
    };

    const handlePreviousPhoto = () => {
      setCurrentPhoto((prevPhoto) => {
        if (prevPhoto === 0) {
          return 0;
        } else {
          return prevPhoto - 1;
        }
      });
    };
    const handleNextPhoto = () => {
      setCurrentPhoto((prevPhoto) => {
        if (prevPhoto === restaurant?.photos?.length - 1) {
          return prevPhoto;
        } else {
          return prevPhoto + 1;
        }
      });
    };

    // Memoize the getPhotoURL function
    const photoURL = useMemo(() => {
      if (restaurant?.photos?.length > 0 && !loading) {
        return restaurant.photos[currentPhoto].photoUrl
          ? restaurant.photos[currentPhoto].photoUrl
          : getPhotoURL(restaurant.photos[currentPhoto].photo_reference);
      } else {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png";
      }
    }, [restaurant?.photos, currentPhoto, loading]);

    const handleNavigatePressed = () => {
      const address = restaurant?.vicinity
        ? restaurant.vicinity
        : "123 Main St, City, State"; // Replace with the desired address

      Linking.canOpenURL("maps://").then((supported) => {
        if (supported) {
          // Open the map application
          const mapAddress = `${encodeURIComponent(
            restaurant?.name
          )},${encodeURIComponent(address)}`;
          Linking.openURL(`maps://maps.apple.com/?q=${mapAddress}`);
        } else {
          console.log("Deep linking not supported on this device.");
          // You can provide an alternative action or UI for unsupported devices
        }
      });
    };

    return (
      <Animated.View
        style={[styles.swipeCard, cardStyle]}
        {...panResponder.panHandlers}
      >
        <Card variant={"swipe"}>
          <>
            {/* Top Half */}
            <Box
              flex={2}
              position="relative"
              width="100%"
              zIndex="z-20"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              {/* Photo List */}
              <Box
                width="100%"
                flex={0.01}
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                padding="l"
                gap="m"
              >
                {restaurant.photos?.map((photo, index) => (
                  <Box
                    key={photo.photo_reference}
                    flex={1}
                    backgroundColor={index === currentPhoto ? "white" : "gray"}
                    height="100%"
                  ></Box>
                ))}
              </Box>

              <Box
                width="100%"
                height="100%"
                position="absolute"
                flexDirection="row"
              >
                <Pressable
                  style={{ flex: 1, height: "100%" }}
                  onPress={handlePreviousPhoto}
                />
                <Pressable
                  style={{ flex: 1, height: "100%" }}
                  onPress={handleNextPhoto}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box
              position="relative"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-end"
              width="100%"
              flexGrow={0.3}
              zIndex="z-10"
              padding="l"
              paddingBottom="none"
              gap="s"
            >
              <Text
                variant="body"
                color="white"
                fontWeight={"bold"}
                fontSize={22}
              >
                {restaurant.name}
              </Text>

              <Text variant="body" color="gray">
                {restaurant.vicinity}
              </Text>

              <StarRating
                disabled={true}
                maxStars={5}
                rating={restaurant.rating}
                iconSet={"Ionicons"}
                emptyStar={"ios-star-outline"}
                fullStar={"ios-star"}
                halfStar={"ios-star-half"}
                fullStarColor={orangeDark}
                emptyStarColor="white"
                starSize={20}
              />
              <Box flex={1} flexDirection={"row"} gap="s">
                {restaurant?.vicinity && (
                  <Ionicons
                    name="md-car-outline"
                    size={35}
                    color={"white"}
                    onPress={handleNavigatePressed}
                  />
                )}
              </Box>
            </Box>
            <Image
              source={{
                uri: photoURL,
              }}
              alt="Restaurant Photo"
              style={styles.image}
            />

            {/* Swipe Card Buttons */}
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-around"
              gap="s"
              width="100%"
              padding="s"
              paddingBottom="s"
              zIndex="z-10"
            >
              <SwipeCardButton
                type="md-close-outline"
                handlePress={handleSwipeLeft}
              />
              <SwipeCardButton
                type="md-heart-outline"
                handlePress={handleSwipeRight}
              />
            </Box>
            <LinearGradient variant="shadow" gradient />
          </>
        </Card>
      </Animated.View>
    );
  }
);

export default SwipeCard;

const styles = StyleSheet.create({
  swipeCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    zIndex: -10,
  },
});
