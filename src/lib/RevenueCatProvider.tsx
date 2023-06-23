import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
} from "react-native-purchases";
import useAuth from "../hooks/useAuth";
import { Platform } from "react-native";
import { updateProfileInFirestore } from "./firebaseHelpers";
import { Timestamp } from "firebase/firestore";

// Define the types
type PurchaserInfo = {
  // Define your custom fields here
  // Example: subscriptions: string[];
  // Example: purchases: string[];
  fetchOfferings: () => {};
  offering: PurchasesOffering;
  makePurchase: Function;
  activeSubscriptions: CustomerInfo["activeSubscriptions"];
  canUpgradeToPremium: boolean;
};

type RevenueCatContextType = PurchaserInfo | null;

type RevenueCatProviderProps = {
  children: ReactNode;
};

// Create a RevenueCat context
const RevenueCatContext = createContext<RevenueCatContextType>(null);

// Custom hook to access the RevenueCat context
export const useRevenueCat = (): RevenueCatContextType =>
  useContext(RevenueCatContext);

// RevenueCatProvider component
export const RevenueCatProvider = ({ children }: RevenueCatProviderProps) => {
  const { user, userProfile } = useAuth();
  const [canUpgradeToPremium, setCanUpgradeToPremium] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    CustomerInfo["activeSubscriptions"] | null
  >(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const init = async () => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === "ios") {
        Purchases.configure({
          apiKey: "appl_GKeIGPqJAbQOInruwFqlYVNlxrZ",
          appUserID: user.uid,
        });
        // identify Purchases SDK with new Firebase user
        await fetchOfferings();
        await fetchCustomerInfo();
      }
    };

    init();
  }, [user]);

  useEffect(() => {
    const fetchInfo = async () => {
      await fetchCustomerInfo();
    };
    Purchases.addCustomerInfoUpdateListener(fetchInfo);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(fetchInfo);
    };
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setActiveSubscriptions(info.activeSubscriptions);
      const premium = info.entitlements.active["Premium Features"];
      const standard = info.entitlements.active["Standard Features"];

      const discovers = userProfile?.discovers || 0;
      const rooms = userProfile?.rooms || 0;

      if (!standard?.isActive && !premium?.isActive) {
        setCanUpgradeToPremium(true);
        if (
          userProfile?.subscriptions.standard ||
          userProfile?.subscriptions.premium
        ) {
          await updateProfileInFirestore(user.uid, {
            ...userProfile,
            subscriptions: {
              free: Timestamp.now(),
              standard: null,
              premium: null,
            },
          });
        }
      }

      if (standard?.isActive) {
        setCanUpgradeToPremium(true);
        if (userProfile?.subscriptions?.standard !== standard.expirationDate) {
          const previousExpirationDate = userProfile?.subscriptions?.standard;
          const monthsSinceExpiration = calculateMonthsBetweenDates(
            previousExpirationDate,
            standard.expirationDate
          );
          await updateProfileInFirestore(user.uid, {
            ...userProfile,
            subscriptions: {
              ...userProfile.subscriptions,
              standard: standard.expirationDate,
              premium: null,
              free: null,
            },
            discovers: discovers + 10 * monthsSinceExpiration,
            rooms: rooms + 5 * monthsSinceExpiration,
          });
        }
      }

      if (premium?.isActive) {
        setCanUpgradeToPremium(false);
        if (userProfile?.subscriptions?.premium !== premium.expirationDate) {
          const previousExpirationDate = userProfile?.subscriptions?.premium;
          const monthsSinceExpiration = calculateMonthsBetweenDates(
            previousExpirationDate,
            premium.expirationDate
          );

          await updateProfileInFirestore(user.uid, {
            ...userProfile,
            subscriptions: {
              ...userProfile.subscriptions,
              premium: premium.expirationDate,
              standard: null,
              free: null,
            },
            discovers: discovers + 20 * monthsSinceExpiration,
            rooms: rooms + 10 * monthsSinceExpiration,
          });
        }
      }
    } catch (error) {}
  };

  const calculateMonthsBetweenDates = (startDate, endDate) => {
    if (startDate === null) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return months > 0 ? months : 1;
  };

  calculateMonthsBetweenDates(
    "2023-06-22T19:45:00.000Z",
    "2023-06-22T20:45:00.000Z"
  );
  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setOffering(offerings.current);
      }
    } catch (e) {
      console.log("Offerings", e);
    }
  };

  const makePurchase = async (packagePurchased) => {
    // Using packages
    try {
      const purchaseMade = await Purchases.purchasePackage(packagePurchased);
      setActiveSubscriptions(purchaseMade.customerInfo.activeSubscriptions);
    } catch (e) {
      if (!e.userCancelled) {
      }
    }
  };
  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
    } catch (e) {}
  };

  const value = useMemo(
    () => ({
      activeSubscriptions,
      restorePurchases,
      offering,
      fetchOfferings,
      makePurchase,
      canUpgradeToPremium,
    }),
    [
      activeSubscriptions,
      restorePurchases,
      offering,
      ,
      fetchOfferings,
      makePurchase,
      canUpgradeToPremium,
    ]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
