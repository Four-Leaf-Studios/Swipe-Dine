import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesOfferings,
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
  products: PurchasesStoreProduct[];
  offering: PurchasesOffering;
  makePurchase: Function;
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
  const [purchaserInfo, setPurchaserInfo] = useState<PurchaserInfo | null>(
    null
  );
  const [products, setProducts] = useState<PurchasesStoreProduct[] | null>(
    null
  );
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
      }
    };

    init();
  }, [user]);

  const fetchProducts = async () => {
    const prods = await Purchases.getProducts([
      "ios_swipeanddine_standard_monthly_8.99_rev",
      "ios_swipeanddine_premium_monthly_12.99",
    ]);
    setProducts(prods);
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
      if (
        typeof purchaseMade.customerInfo.entitlements.active[
          "Standard Features"
        ] !== "undefined"
      ) {
        // Unlock that great standard content.
        console.log("Standard Features unlocked.");
      } else if (
        typeof purchaseMade.customerInfo.entitlements.active[
          "Premium Features"
        ] !== "undefined"
      ) {
        // Unlock premium content.
        console.log("Premium Features Unlocked.");
      }
    } catch (e) {
      if (!e.userCancelled) {
      }
    }
  };

  const fetchCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (
        typeof customerInfo.entitlements.active[
          "<my_entitlement_identifier>"
        ] !== "undefined"
      ) {
        // Grant user "pro" access
      }
    } catch (e) {
      // Error fetching purchaser info
    }
  };

  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
    } catch (e) {}
  };

  const value = {
    purchaserInfo,
    products,
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
