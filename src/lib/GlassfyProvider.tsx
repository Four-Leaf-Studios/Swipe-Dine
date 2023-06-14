import { createContext, useContext, useEffect, useState } from "react";
import {
  Glassfy,
  GlassfyOffering,
  GlassfyPermission,
  GlassfySku,
  GlassfyTransaction,
} from "react-native-glassfy-module";
import useAuth, { UserInfo } from "../hooks/useAuth";
import { updateUserProfileInFirestore } from "./firebaseHelpers";

interface GlassfyProps {
  purchase?: (sku: GlassfySku) => Promise<void>;
  restorePermissions?: () => Promise<GlassfySku>;
  user: UserInfo;
  offerings: GlassfyOffering[];
}

const GlassfyContext = createContext<GlassfyProps | null>(null);

// Change this to your Glassfy key
// https://dashboard.glassfy.io/0/settings
const GLASSFY_KEY = "106dd4829d344aeab49e1554ecf4ea08";

// Provide Glassfy functions to our app
export const GlassfyProvider = ({ children }: any) => {
  const { userProfile: user, setUserProfile: setUser } = useAuth();
  const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      // Intialise Glassfy and set our provider ready
      await Glassfy.initialize(GLASSFY_KEY, false);
      setIsReady(true);
      // Glassfy.setLogLevel(GLASSFY_LOGLEVEL.ALL);

      // Load all offerings (products) and permissions (previous purchases)
      await loadOfferings();
      await loadPermissions();
    };
    init();
  }, []);

  // Load all offerings a user can purchase
  const loadOfferings = async () => {
    let offerings = await Glassfy.offerings();
    setOfferings(offerings.all);
  };

  // Load all permissions a user has
  const loadPermissions = async () => {
    let permissions = await Glassfy.permissions();
    handleExistingPermissions(permissions.all);
  };

  // Restore previous purchases
  const restorePermissions = async () => {
    let sku = await Glassfy.restorePurchases();
    return sku;
  };

  // Purchase one SKU and handle a successful transaction
  const purchase = async (sku: GlassfySku) => {
    const transaction = await Glassfy.purchaseSku(sku);

    if (transaction.receiptValidated) {
      handleSuccessfulTransactionResult(transaction, sku);
    }
  };

  // Update user state based on previous purchases
  const handleExistingPermissions = (permissions: GlassfyPermission[]) => {
    const newUser = { ...user };
    for (const perm of permissions) {
      if (perm.isValid) {
        if (perm.permissionId === "standard_features") {
          newUser.subscriptions.standard = true;
        } else if (perm.permissionId === "premium_features") {
          newUser.subscriptions.premium = true;
        }
      }
    }
    setUser(newUser);
  };

  // Update the user state based on what we purchased
  const handleSuccessfulTransactionResult = async (
    transaction: GlassfyTransaction,
    sku: GlassfySku
  ) => {
    const productID = (transaction as any).productId;
    let discovers = user.discovers || 0;
    let rooms = user.rooms || 0;
    let newUser = null;
    if (productID.indexOf("swipeanddine_standard_monthly_8.99_7days_0") >= 0) {
      newUser = {
        ...user,
        subscriptions: {
          ...user.subscriptions,
          free: false,
          standard: true,
        },
        discovers: (discovers += +sku.extravars.discovers),
        rooms: (rooms += +sku.extravars.rooms),
      };
      setUser(newUser);
    }
    if (productID.indexOf("swipeanddine_premium_monthly_12.99_7days_0") >= 0) {
      newUser = {
        ...user,
        subscriptions: {
          ...user.subscriptions,
          free: false,
          premium: true,
        },
        discovers: (discovers += +sku.extravars.discovers),
        rooms: (rooms += +sku.extravars.discovers),
      };
      setUser(newUser);
    }
    updateUserProfileInFirestore(user.uid, newUser);
  };

  const value = {
    loadPermissions,
    purchase,
    restorePermissions,
    user,
    offerings,
  };

  // Return empty fragment if provider is not ready (Glassfy not yet initialised)
  if (!isReady) return <></>;

  return (
    <GlassfyContext.Provider value={value}>{children}</GlassfyContext.Provider>
  );
};

// Export context for easy usage
export const useGlassfy = () => {
  return useContext(GlassfyContext) as GlassfyProps;
};
