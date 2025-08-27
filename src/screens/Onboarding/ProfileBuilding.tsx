import React, { useEffect, useMemo, useState, FC, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  Platform,
  PermissionsAndroid,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressBar from "../../components/progressBars/ProgressBar";
import Header from "../../components/headerBlocks/HeaderProfileOnBoarding";
import { COLORS } from "../../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { utilityStyles } from "../../styles/utilities";
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
  MediaType,
} from "react-native-image-picker";
import type { ImageLibraryOptions } from "react-native-image-picker";
import UploadBottomSheet from "../../components/bottomSheets/UploadBottomSheet";
import ColorButton1 from "../../components/common/switchColorButtons/colorButton1";
import ColorSubDescriptiveButton from "../../components/common/switchColorButtons/colorSubDescriptiveButton";
import DOBPicker from "../../components/common/datePicker/DOBPicker";
import AnimatedToggleSwitch from "../../components/common/toggleSwitch/toggleSwitch";
import { Picker } from "@react-native-picker/picker";

const TOTAL_STEPS = 4;

// —————————————————————————————————————————————————————————
// Storage keys
// —————————————————————————————————————————————————————————
const STORAGE_KEYS = {
  FULL_PROFILE: "profile.full",
  CURRENT_STEP: "profile.currentStep",
};

// —————————————————————————————————————————————————————————
// Types
// —————————————————————————————————————————————————————————
export type Props = {
  showHeaderSkip?: boolean;
};

export type CompleteProfilePayload = {
  // step 1
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: string; // DD/MM/YYYY
  gender: string;
  languages: string[]; // full list including customs
  languagesSelected: string[];
  bio: string;
  instagram: string;
  // step 2
  profilePhoto: Asset | null;
  // step 3
  travelPreferences: string[];
  travelBudget: string | null;
  // step 4
  selectedTravelWith: string[];
  selectedAgeGroup: string[]; // single-select but kept array for compatibility
  selectedDestinations: string[];
  selectedGoals: string[];
  profileVisibility: string;
  tripInvites: string;
};

// —————————————————————————————————————————————————————————
// API (stub)
// —————————————————————————————————————————————————————————
async function completeProfile(payload: CompleteProfilePayload) {
  // TODO: replace the URL + headers with your real API
  const url = "https://api.example.com/profile/complete";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Submit failed (${res.status}): ${text}`);
  }

  return res.json();
}

// —————————————————————————————————————————————————————————
// Component
// —————————————————————————————————————————————————————————
const ProfileBuilding: React.FC<Props> = ({ showHeaderSkip = true }) => {
  // UI step
  const [step, setStep] = useState(1);

  // Lifted form state (used for validation & submission)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const initialLanguages = ["English", "Hindi", "Punjabi", "Tamil"];
  const [languages, setLanguages] = useState<string[]>(initialLanguages);
  const [languagesSelected, setLanguagesSelected] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");

  // profile photo (Asset from react-native-image-picker)
  const [profilePhoto, setProfilePhoto] = useState<Asset | null>(null);
  // preferences
  const [travelPreferences, setTravelPreferences] = useState<string[]>([]);
  const [travelBudget, setTravelBudget] = useState<string | null>(null);

  const [selectedTravelWith, setSelectedTravelWith] = useState<string[]>(["Anyone"]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string[]>(["Anyone"]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [tripInvites, setTripInvites] = useState("Yes");

  // Search mode for step 4
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 2) helpers: build/save/load the full profile
  const saveTimer = useRef<any>(null);
  const isRestoringRef = useRef(true); // prevents save while restoring

  const buildProfileObject = (): CompleteProfilePayload => ({
    // step 1
    fullName,
    email,
    phoneNumber,
    birthDate,
    gender,
    languages,
    languagesSelected,
    bio,
    instagram,
    // step 2
    profilePhoto,
    // step 3
    travelPreferences,
    travelBudget,
    // step 4
    selectedTravelWith,
    selectedAgeGroup,
    selectedDestinations,
    selectedGoals,
    profileVisibility,
    tripInvites,
  });

  const serializableProfile = (p: CompleteProfilePayload) => {
    const photo = p.profilePhoto
      ? {
          uri: p.profilePhoto.uri,
          fileName: (p.profilePhoto as any).fileName || null,
          type: (p.profilePhoto as any).type || null,
        }
      : null;

    return { ...p, profilePhoto: photo };
  };

  const persistFullProfile = async (profile?: CompleteProfilePayload) => {
    try {
      const toSave = profile ?? buildProfileObject();
      await AsyncStorage.setItem(
        STORAGE_KEYS.FULL_PROFILE,
        JSON.stringify(serializableProfile(toSave))
      );
    } catch (e) {
      console.warn("Failed to persist full profile:", e);
    }
  };

  const persistCurrentStep = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
    } catch (e) {
      console.warn("Failed to persist current step:", e);
    }
  };

  const loadStoredData = async () => {
    try {
      isRestoringRef.current = true;

      const [profileRaw, stepRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FULL_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_STEP),
      ]);

      if (profileRaw) {
        const p = JSON.parse(profileRaw) as Partial<
          CompleteProfilePayload & {
            profilePhoto?: { uri?: string; fileName?: string; type?: string };
          }
        >;

        // populate your existing state setters:
        setFullName(p.fullName || "");
        setEmail(p.email || "");
        setPhoneNumber(p.phoneNumber || "");
        setBirthDate(p.birthDate || "");
        setGender(p.gender || "");
        setLanguages(p.languages || initialLanguages);
        setLanguagesSelected(p.languagesSelected || []);
        setBio(p.bio || "");
        setInstagram(p.instagram || "");

        // profile photo -> convert minimal persisted shape back to Asset-like object
        if (p.profilePhoto?.uri) {
          setProfilePhoto({
            uri: p.profilePhoto.uri,
            fileName: p.profilePhoto.fileName || undefined,
            type: p.profilePhoto.type || undefined,
          } as Asset);
        } else {
          setProfilePhoto(null);
        }

        setTravelPreferences(p.travelPreferences || []);
        setTravelBudget(p.travelBudget ?? null);
        setSelectedTravelWith(p.selectedTravelWith || ["Anyone"]);
        setSelectedAgeGroup(p.selectedAgeGroup || ["Anyone"]);
        setSelectedDestinations(p.selectedDestinations || []);
        setSelectedGoals(p.selectedGoals || []);
        setProfileVisibility(p.profileVisibility || "Public");
        setTripInvites(p.tripInvites || "Yes");
      }

      if (stepRaw) {
        const loadedStep = Number(stepRaw);
        if (!isNaN(loadedStep) && loadedStep >= 1 && loadedStep <= TOTAL_STEPS) {
          setStep(loadedStep);
        }
      }

      // mark restore done after small delay so initial setState won't trigger save
      setTimeout(() => (isRestoringRef.current = false), 50);
    } catch (e) {
      console.warn("Failed to load stored data:", e);
      isRestoringRef.current = false;
    }
  };

  const scheduleSave = () => {
    if (isRestoringRef.current) return; // don't save while restoring
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistFullProfile();
      saveTimer.current = null;
    }, 800); // debounce delay — tune as you like
  };

  useEffect(() => {
    // wire it to all form fields that you want auto-saved
    scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fullName,
    email,
    phoneNumber,
    birthDate,
    gender,
    languages,
    languagesSelected,
    bio,
    instagram,
    profilePhoto,
    travelPreferences,
    travelBudget,
    selectedTravelWith,
    selectedAgeGroup,
    selectedDestinations,
    selectedGoals,
    profileVisibility,
    tripInvites,
  ]);

  useEffect(() => {
    if (!isRestoringRef.current) {
      persistCurrentStep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    loadStoredData();
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  // Basic validation per-step. Tweak rules here.
  const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e);
  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };
  const isOldEnough = useMemo(() => {
    if (!birthDate) return false;
    const [d, m, y] = birthDate.split("/");
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    return calculateAge(dt) >= 18;
  }, [birthDate]);

  const canContinue = useMemo(() => {
    if (step === 1) {
      // require name, valid email, 10-digit phone, birthDate and gender, ≥1 language
      return (
        fullName.trim().length > 1 &&
        isValidEmail(email) &&
        phoneNumber.trim().length === 10 &&
        isOldEnough &&
        gender.trim().length > 0 &&
        languagesSelected.length > 0
      );
    } else if (step === 2) {
      return profilePhoto != null;
    } else if (step === 3) {
      return travelPreferences.length > 0 && travelBudget !== null;
    } else if (step === 4) {
      return (
        selectedTravelWith.length > 0 &&
        selectedAgeGroup.length > 0 &&
        selectedDestinations.length > 0 &&
        selectedGoals.length > 0
      );
    }
    return true;
  }, [
    step,
    fullName,
    email,
    phoneNumber,
    birthDate,
    gender,
    languagesSelected,
    profilePhoto,
    travelPreferences,
    travelBudget,
    selectedTravelWith,
    selectedAgeGroup,
    selectedDestinations,
    selectedGoals,
    profileVisibility,
    tripInvites,
    isOldEnough,
  ]);

  const clearPersisted = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.FULL_PROFILE),
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_STEP),
    ]);
  };

  const handleContinue = async () => {
    if (!canContinue) {
      Alert.alert("Incomplete", "Please fill required fields on this step.");
      return;
    }

    try {
      if (step < TOTAL_STEPS) {
        next();
        return;
      }

      // final submit
      const payload: CompleteProfilePayload = {
        fullName,
        email,
        phoneNumber,
        birthDate,
        gender,
        languages,
        languagesSelected,
        bio,
        instagram,
        profilePhoto,
        travelPreferences,
        travelBudget,
        selectedTravelWith,
        selectedAgeGroup,
        selectedDestinations,
        selectedGoals,
        profileVisibility,
        tripInvites,
      };

      // Hit API (replace URL in completeProfile)
      await completeProfile(payload);

      Alert.alert("Submitted", "Profile submitted successfully.");
      await clearPersisted(); // ✅ cleanup stored data so next time flow restarts
    } catch (err: any) {
      console.warn("Submit error", err);
      Alert.alert("Error", err?.message || "Something went wrong while submitting.");
    }
  };

  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isSearchMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSearchMode]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim }}>
        <Header
          onBack={back}
          onSkip={() => setStep(TOTAL_STEPS)}
          showSkip={showHeaderSkip && step < TOTAL_STEPS}
        />

        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: "400", width: "100%", textAlign: "right" }}>
            {step}/{TOTAL_STEPS}
          </Text>
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </View>
      </Animated.View>

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
        extraHeight={24}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        style={{ flex: 1 }}
      >
        {step === 1 && (
          <BasicInfoScreen
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            gender={gender}
            setGender={setGender}
            bio={bio}
            setBio={setBio}
            instagram={instagram}
            setInstagram={setInstagram}
            languages={languages}
            setLanguages={setLanguages}
            selectedLanguages={languagesSelected}
            setSelectedLanguages={setLanguagesSelected}
          />
        )}
        {step === 2 && (
          <ProfilePhotoScreen profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />
        )}
        {step === 3 && (
          <TravelPreferencesScreen
            travelPreferences={travelPreferences}
            setTravelPreferences={setTravelPreferences}
            travelBudget={travelBudget}
            setTravelBudget={setTravelBudget}
          />
        )}
        {step === 4 && (
          <MatchPreferencesScreen
            selectedTravelWith={selectedTravelWith}
            setSelectedTravelWith={setSelectedTravelWith}
            selectedAgeGroup={selectedAgeGroup}
            setSelectedAgeGroup={setSelectedAgeGroup}
            selectedDestinations={selectedDestinations}
            setSelectedDestinations={setSelectedDestinations}
            selectedGoals={selectedGoals}
            setSelectedGoals={setSelectedGoals}
            profileVisibility={profileVisibility}
            setProfileVisibility={setProfileVisibility}
            tripInvites={tripInvites}
            setTripInvites={setTripInvites}
            isSearchMode={isSearchMode}
            setIsSearchMode={setIsSearchMode}
          />
        )}

        <View style={utilityStyles.buttonContainer}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              utilityStyles.continueButton,
              canContinue && utilityStyles.continueButtonActive,
              pressed && { opacity: 0.85 },
              !canContinue && { opacity: 1 },
            ]}
            disabled={!canContinue}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canContinue }}
          >
            <Text style={utilityStyles.continueButtonText}>
              {step === TOTAL_STEPS ? "Submit" : "Next"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

/* --------------------- Basic Info (gender uses Picker) --------------------- */

type BasicInfoProps = {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  instagram: string;
  setInstagram: (v: string) => void;
  languages: string[];
  setLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
};

const BasicInfoScreen: React.FC<BasicInfoProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  bio,
  setBio,
  instagram,
  setInstagram,
  languages,
  setLanguages,
  selectedLanguages,
  setSelectedLanguages,
}) => {
  const [newLang, setNewLang] = useState("");

  const toggleSelect = (lang: string) => {
    setSelectedLanguages((prev) => {
      return prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang];
    });
  };

  const addLanguage = () => {
    const trimmed = newLang.trim();
    if (!trimmed) return;
    if (!languages.includes(trimmed)) setLanguages((p) => [trimmed, ...p]);
    if (!selectedLanguages.includes(trimmed)) setSelectedLanguages((p) => [trimmed, ...p]);
    setNewLang("");
  };

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={styles.title}>Basic Info</Text>
      <Text style={styles.subtitle}>Tell us about yourself</Text>

      <Text style={styles.inputLabel}>
        Full Name<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>
      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.inputLabel}>
        Email<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>
      <TextInput
        placeholder="Enter your email address"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.inputLabel}>
        Phone<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>
      <View style={styles.phoneContainer}>
        <View style={[styles.countryCodeBox, styles.input]}>
          <Image
            source={require("../../assets/images/indiaFlag.png")}
            style={styles.flag}
          />
        </View>

        <View style={[styles.phoneInputContainer, styles.input]}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={[styles.phoneInput]}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={(text) => {
              const sanitized = text.replace(/\D/g, ""); // remove non-digits
              setPhoneNumber(sanitized);
            }}
          />
        </View>
      </View>

      <Text style={styles.inputLabel}>
        Birth Date<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>

      <DOBPicker
        value={birthDate}
        onChange={setBirthDate}
        minAge={18}
        placeholder="DD/MM/YYYY"
      />
      <Text style={[styles.inputLabel]}>
        Gender<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>

      {/* Picker-based gender selection (better UX than free text) */}
      <View style={[styles.input, { display: "flex", padding: 0, overflow: "hidden" }]}>
        {/* If you prefer RN Picker, swap for your Picker component here */}
        {/* Example shows @react-native-picker/picker usage */}
        {/* @ts-ignore - Picker is provided elsewhere in your project */}
        <Picker selectedValue={gender} onValueChange={(val: string) => setGender(val)} style={{ padding: 0, height: 55, marginTop: -5 }}>
          <Picker.Item style={{ color: COLORS.base.gray }} label="Select gender..." value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Prefer not to say" value="prefer_not_say" />
        </Picker>
      </View>

      <Text style={styles.inputLabel}>
        Languages You Speak<Text style={{ color: COLORS.error[1] }}> *</Text>
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          placeholder="Choose below or type"
          value={newLang}
          onChangeText={setNewLang}
          style={[styles.input, { width: "80%", marginBottom: 15 }]}
        />
        <Pressable style={styles.addLangBtn} onPress={addLanguage}>
          <Text style={{ color: "#fff", fontWeight: "400", fontSize: 28 }}>+</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {languages.map((lang, index) => {
          const isSelected = selectedLanguages.includes(lang);
          return (
            <Pressable
              key={index}
              onPress={() => toggleSelect(lang)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? COLORS.primary[1] : COLORS.base.white,
                  borderColor: isSelected ? COLORS.primary[1] : COLORS.neutral[1],
                },
              ]}
            >
              <Text style={{ color: isSelected ? "#fff" : COLORS.secondary[1], fontWeight: "500" }}>
                {lang}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>



      <Text style={[styles.inputLabel]}>Bio</Text>
      <TextInput
        placeholder="Tell us about yourself, your travel experiences, and what you’re looking for..."
        style={[styles.input, styles.bioInput]}
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <Text style={styles.inputLabel}>Instagram</Text>
      <TextInput placeholder="@" style={styles.input} value={instagram} onChangeText={setInstagram} />
    </View>

  );
};

/* --------------------- Profile Photo (camera / library) --------------------- */

type ProfilePhotoProps = {
  profilePhoto: Asset | null;
  setProfilePhoto: React.Dispatch<React.SetStateAction<Asset | null>>;
};

const ProfilePhotoScreen: React.FC<ProfilePhotoProps> = ({ profilePhoto, setProfilePhoto }) => {
  const imageOptions: ImageLibraryOptions = {
    mediaType: "photo" as MediaType,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
  };
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleChooseFromLibrary = () => {
    launchImageLibrary(imageOptions, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.warn("ImagePicker error:", response.errorMessage);
        Alert.alert("Error", response.errorMessage || "Could not pick the image.");
        return;
      }
      if (response.assets && response.assets.length > 0) setProfilePhoto(response.assets[0]);
    });
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "We need access to your camera to take a photo.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission denied", "Camera permission is required to take a photo.");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    launchCamera({ ...imageOptions, saveToPhotos: true }, (response: ImagePickerResponse) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.warn("ImagePicker error:", response.errorMessage);
        Alert.alert("Error", response.errorMessage || "Could not take the picture.");
        return;
      }
      if (response.assets && response.assets.length > 0) setProfilePhoto(response.assets[0]);
    });
  };

  const onUploadPress = () => {
    setSheetVisible(true);
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Text style={styles.title}>Profile Photo</Text>
      <Text style={styles.subtitle}>Add a photo to get more matches</Text>

      <View style={styles.uploadPhotoContainer}>
        <Pressable
          style={styles.uploadPhotoPressableContainer}
          onPress={onUploadPress}
          accessibilityRole="button"
        >
          {!profilePhoto ? (
            <View style={styles.cameraPlusIconBox}>
              <Image source={require("../../assets/images/camera-plus.png")} />
            </View>
          ) : null}

          {profilePhoto ? (
            <Image source={{ uri: profilePhoto.uri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
          ) : (
            <Image source={require("../../assets/images/userIcon.png")} />
          )}
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { marginBottom: 50 }]}>
        Upload a clear photo of yourself. This helps other travelers recognize you!
      </Text>

      {/* Modern Bottom Sheet */}
      <UploadBottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromLibrary={handleChooseFromLibrary}
        onRemovePhoto={() => setProfilePhoto(null)}
        profilePhoto={profilePhoto}
      />
    </View>
  );
};

/* --------------------- Travel Preferences --------------------- */

type PropsTravelPreferences = {
  travelPreferences: string[];
  setTravelPreferences: (preferences: string[]) => void;
  travelBudget: string | null;
  setTravelBudget: (budget: string) => void;
};

const TravelPreferencesScreen: React.FC<PropsTravelPreferences> = ({
  travelPreferences,
  setTravelPreferences,
  travelBudget,
  setTravelBudget,
}) => {
  const options = [
    { title: "Backpacking", subtitle: "Budget friendly, authentic experiences" },
    { title: "Luxury", subtitle: "Premium stays & fine dining" },
    { title: "Adventure", subtitle: "Thrills and outdoor activities" },
    { title: "Cultural", subtitle: "Local traditions & heritage" },
  ];

  const togglePreference = (pref: string) => {
    let updated: string[];
    if (travelPreferences.includes(pref)) {
      updated = travelPreferences.filter((p) => p !== pref);
    } else {
      updated = [...travelPreferences, pref];
    }
    setTravelPreferences(updated);
  };

  const onSelectBudget = (index: number) => {
    setTravelBudget(options[index].title);
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Text style={styles.title}>Travel Preferences</Text>
      <Text style={[styles.subtitle, { marginBottom: 30 }]}>
        Share your travel preferences, and we’ll personalize recommendations.
        No worries! you can modify them later in settings.
      </Text>

      {/* Preferences chips */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 10 }}>
        {[
          "Adventure",
          "Relaxation",
          "Cultural",
          "Food",
          "Nature",
          "City",
          "Beach",
          "Mountains",
          "Desert",
          "Forest",
        ].map((pref) => (
          <ColorButton1
            key={pref}
            text={pref}
            isSelected={travelPreferences.includes(pref)}
            onPress={() => togglePreference(pref)}
          />
        ))}
      </View>

      {/* Budget single-select */}
      <Text style={styles.labelTitle}>How do you prefer to travel?</Text>
      <View style={{ marginBottom: 40 }}>
        {options.map((opt, index) => (
          <ColorSubDescriptiveButton
            key={index}
            title={opt.title}
            subtitle={opt.subtitle}
            active={travelBudget === opt.title}
            onPress={() => onSelectBudget(index)}
          />
        ))}
      </View>
    </View>
  );
};

/* --------------------- Match Preferences (age single-select) --------------------- */

type MatchPreferencesProps = {
  selectedTravelWith: string[];
  setSelectedTravelWith: (val: string[]) => void;
  selectedAgeGroup: string[];
  setSelectedAgeGroup: (val: string[]) => void;
  selectedDestinations: string[];
  setSelectedDestinations: (val: string[]) => void;
  selectedGoals: string[];
  setSelectedGoals: (val: string[]) => void;
  profileVisibility: string;
  setProfileVisibility: (val: string) => void;
  tripInvites: string;
  setTripInvites: (val: string) => void;
  isSearchMode: boolean;
  setIsSearchMode: (val: boolean) => void;
};

const MatchPreferencesScreen: FC<MatchPreferencesProps> = ({
  selectedTravelWith,
  setSelectedTravelWith,
  selectedAgeGroup,
  setSelectedAgeGroup,
  selectedDestinations,
  setSelectedDestinations,
  selectedGoals,
  setSelectedGoals,
  profileVisibility,
  setProfileVisibility,
  tripInvites,
  setTripInvites,
  isSearchMode,
  setIsSearchMode,
}) => {
  const travelWithOptions = ["Anyone", "Friends", "Family", "Partner"];
  const ageCatOptions = ["Anyone", "18-25", "26-35", "36-50", "50+"];
  const destinations = [
    { id: 'bc46b04a-cf7d-4283-b46d-e013a15b9361', name: 'Kashmir' },
    { id: '1aaa0caf-58bd-4cbe-8951-83b30f2f9d51', name: 'Goa' },
    { id: '4343af2f-434c-4d9d-89b5-75836eb5853a', name: 'Jaipur' },
    { id: 'd0e23748-a173-4758-8331-873254acbe2a', name: 'Rishikesh' },
    { id: 'b4a2114c-60f1-4155-befd-80297f380452', name: 'Leh-Ladakh' },
    { id: 'c6f8e25d-7177-4aca-91d2-87f6e1c350a8', name: 'Manali' },
    { id: '9261d56b-0256-4b7f-8a6f-2ce92e11144e', name: 'Mysore' },
    { id: '0c103caf-d534-4d0d-b73d-9ab602399f12', name: 'Coorg' },
    { id: 'b4f75736-823b-4376-a9f5-5d86e4142c22', name: 'Ooty' },
    { id: '51c6d74e-0745-4151-8056-e200f2af111e', name: 'Darjeeling' },
  ];
  const goals = ["Making friends", "Adventure", "Relaxation", "Exploring cultures"];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleSelectTravelWith = (travel: string) => {
    setSelectedTravelWith(
      selectedTravelWith.includes(travel)
        ? selectedTravelWith.filter((t) => t !== travel)
        : [...selectedTravelWith, travel]
    );
  };

  // ✅ strictly single-select for age group (radio behavior)
  const chooseAgeGroup = (age: string) => {
    setSelectedAgeGroup([age]);
  };

  const toggleSelectDestination = (id: string) => {
    setSelectedDestinations(
      selectedDestinations.includes(id)
        ? selectedDestinations.filter((d) => d !== id)
        : [...selectedDestinations, id]
    );
  };

  const toggleSelectGoal = (goal: string) => {
    setSelectedGoals(
      selectedGoals.includes(goal)
        ? selectedGoals.filter((g) => g !== goal)
        : [...selectedGoals, goal]
    );
  };

  const opacityAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: isSearchMode ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: isSearchMode ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSearchMode]);

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Animated.View style={{ opacity: opacityAnim }}>
        <Text style={styles.title}>Match Preferences</Text>
        <Text style={[styles.subtitle, { marginBottom: 30 }]}>Tell us who you’d love to travel with.</Text>

        <Text style={styles.labelTitle}>Who would you like to travel with? *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
          {travelWithOptions.map((travel, index) => {
            const isSelected = selectedTravelWith.includes(travel);
            return (
              <Pressable
                key={index}
                onPress={() => toggleSelectTravelWith(travel)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? COLORS.primary[1] : COLORS.base.white,
                    borderColor: isSelected ? COLORS.primary[1] : COLORS.neutral[1],
                  },
                ]}
              >
                <Text style={{ color: isSelected ? "#fff" : COLORS.neutral[1], fontWeight: "500" }}>{travel}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.labelTitle}>Preferred age group for travel buddies *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
          {ageCatOptions.map((age, index) => {
            const isSelected = selectedAgeGroup.includes(age);
            return (
              <Pressable
                key={index}
                onPress={() => chooseAgeGroup(age)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? COLORS.primary[1] : COLORS.base.white,
                    borderColor: isSelected ? COLORS.primary[1] : COLORS.neutral[1],
                  },
                ]}
              >
                <Text style={{ color: isSelected ? "#fff" : COLORS.neutral[1], fontWeight: "500" }}>{age}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      <Animated.Text style={[styles.labelTitle, { opacity: opacityAnim }]}>
        Favourite travel destinations *
      </Animated.Text>
      <Animated.View
        style={{
          transform: [
            {
              translateY: translateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -250], // Adjust this value based on your layout to move the input up
              }),
            },
          ],
          position: isSearchMode ? "absolute" : "relative",
          left: isSearchMode ? 20 : 0,
          right: isSearchMode ? 20 : 0,
          zIndex: 10,
          backgroundColor: isSearchMode ? COLORS.base.white : "transparent",
        }}
      >
        <TextInput
          placeholder="Your favourite destination"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchMode(true)}
        />
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
          {selectedDestinations.map((id) => {
            const dest = destinations.find((d) => d.id === id);
            if (!dest) return null;
            return (
              <Pressable
                key={id}
                onPress={() => toggleSelectDestination(id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: COLORS.primary[1],
                    borderColor: COLORS.primary[1],
                  },
                ]}
              >
                <Text style={{ color: "#fff", fontWeight: "500" }}>{dest.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {isSearchMode && (
        <Animated.View
          style={{
            opacity: translateAnim,
            position: "absolute",
            top: 50, // Adjust based on input position after animation
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.base.white,
          }}
        >
          <Pressable
            style={{ position: "absolute", top: 10, right: 20, zIndex: 11 }}
            onPress={() => {
              setIsSearchMode(false);
              setSearchQuery("");
            }}
          >
            <Text style={{ color: COLORS.primary[1], fontSize: 16 }}>Cancel</Text>
          </Pressable>
          <ScrollView style={{ marginTop: 60 }}>
            {filteredDestinations.map((dest) => {
              const isSelected = selectedDestinations.includes(dest.id);
              return (
                <Pressable
                  key={dest.id}
                  onPress={() => toggleSelectDestination(dest.id)}
                  style={[
                    styles.searchItem,
                    isSelected && styles.searchItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.searchItemText,
                      isSelected && styles.searchItemTextSelected,
                    ]}
                  >
                    {dest.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}

      <Animated.View style={{ opacity: opacityAnim }}>
        <Text style={styles.labelTitle}>Your travel goal *</Text>
        <View style={styles.containerGoals}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[styles.option, selectedGoals.includes(goal) && styles.optionSelected]}
              onPress={() => toggleSelectGoal(goal)}
            >
              <Text style={[styles.optionText, selectedGoals.includes(goal) && styles.optionTextSelected]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={styles.labelTitle}>Privacy</Text>

          {/* Show my profile to others */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
              <Text style={{ fontSize: 12, color: "#222" }}>Show my profile to others</Text>
            </View>
            <View>
              <AnimatedToggleSwitch options={["Public", "Private"]} value={profileVisibility} onChange={setProfileVisibility} />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <View>
              <Text style={{ fontSize: 12, color: "#222" }}>Allow trip invites</Text>
            </View>
            <View>
              <AnimatedToggleSwitch options={["Yes", "No"]} value={tripInvites} onChange={setTripInvites} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

// —————————————————————————————————————————————————————————
// Styles (kept as-is)
// —————————————————————————————————————————————————————————
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, width: "100%", textAlign: "center", color: COLORS.base.black },
  labelTitle: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 10, color: COLORS.base.black },
  subtitle: { fontSize: 14, fontWeight: "400", marginBottom: 20, paddingHorizontal: "10%", width: "100%", textAlign: "center", color: COLORS.base.gray },
  inputLabel: { fontSize: 16, fontWeight: "400", marginBottom: 10, color: COLORS.secondary[1] },
  input: {
    borderWidth: 2,
    borderColor: COLORS.primary[1] + "AF",
    height: 50,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    marginRight: 15,
  },
  phoneInputContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    width: "15%",
  },
  phoneInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "85%",
    height: 50,
    color: COLORS.base.black,
    textAlign: "left",
    fontSize: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  bioInput: {
    height: 100,
  },
  addLangBtn: {
    backgroundColor: COLORS.primary[1],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "15%",
    height: 50,
  },
  uploadPhotoContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.primary[1],
    borderStyle: "dashed",
    borderRadius: 100,
    width: 100,
    height: 100,
    marginHorizontal: "auto",
    backgroundColor: COLORS.primary[1] + "19",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  uploadPhotoPressableContainer: {
    position: "relative",

    width: 100,
    height: 100,

    alignItems: "center",
    justifyContent: "center",
  },
  cameraPlusIconBox: {
    position: "absolute",
    bottom: -5,
    right: -10,
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  containerGoals: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  option: {
    borderWidth: 2,
    borderColor: COLORS.primary[1] + "60",
    width: "48%",
    height: 70,
    borderRadius: 16,
    marginBottom: 10,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: COLORS.primary[1],
    borderColor: COLORS.primary[1],
  },
  optionText: {
    fontSize: 14,
    color: COLORS.base.black,
    fontWeight: "bold",
  },
  optionTextSelected: {
    color: COLORS.base.white,
    fontWeight: "600",
  },
  searchItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[1],
  },
  searchItemSelected: {
    backgroundColor: COLORS.primary[1] + "30",
  },
  searchItemText: {
    fontSize: 16,
    color: COLORS.neutral[1],
  },
  searchItemTextSelected: {
    color: COLORS.primary[1],
    fontWeight: "bold",
  },
});

export default ProfileBuilding;