import * as Location from "expo-location";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const getUserLocation = async (): Promise<Coordinates> => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = location.coords;
  return { latitude, longitude };
};

export { getUserLocation };
