import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GoogleLoginBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points (height of sheet)
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info", userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Open Login" onPress={handleOpen} />

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Sign in</Text>
          <Button title="Continue with Google" onPress={handleGoogleLogin} />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
  contentContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
});

export default GoogleLoginBottomSheet;
