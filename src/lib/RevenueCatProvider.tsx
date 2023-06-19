import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesStoreProduct,
} from "react-native-purchases";
import useAuth from "../hooks/useAuth";
import { Platform } from "react-native";

// Define the types
type PurchaserInfo = {
  // Define your custom fields here
  // Example: subscriptions: string[];
  // Example: purchases: string[];
  fetchOfferings: () => {};
  offering: PurchasesOffering;
  makePurchase: Function;
  activeSubscriptions: CustomerInfo["activeSubscriptions"];
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
  const { user } = useAuth();
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

  const fetchCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setActiveSubscriptions(info.activeSubscriptions);
    } catch (error) {}
  };

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

  const value = {
    activeSubscriptions,
    restorePurchases,
    offering,
    fetchOfferings,
    makePurchase,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
