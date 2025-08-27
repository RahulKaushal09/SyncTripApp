import React, { useState, useMemo } from "react";
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
} from "react-native";
import ProgressBar from "../../components/progressBars/ProgressBar";
import Header from "../../components/headerBlocks/HeaderProfileOnBoarding";
import { COLORS } from "../../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { utilityStyles } from "../../styles/utilities";
import { launchCamera, launchImageLibrary, Asset, ImagePickerResponse, MediaType } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { ImageLibraryOptions } from './../../../node_modules/react-native-image-picker/lib/typescript/types.d';
import UploadBottomSheet from "../../components/bottomSheets/UploadBottomSheet";
import ColorButton1 from "../../components/common/switchColorButtons/colorButton1";
import ColorSubDescriptiveButton from "../../components/common/switchColorButtons/colorSubDescriptiveButton";

const TOTAL_STEPS = 4;

type Props = {
    showHeaderSkip?: boolean;
};

const ProfileBuilding: React.FC<Props> = ({ showHeaderSkip = true }) => {
    // UI step
    const [step, setStep] = useState(1);

    // Lifted form state (used for validation & submission)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [languagesSelected, setLanguagesSelected] = useState<string[]>([]);
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");

    // profile photo (Asset from react-native-image-picker)
    const [profilePhoto, setProfilePhoto] = useState<Asset | null>(null);
    // preferences
    const [travelPreferences, setTravelPreferences] = useState<string[]>([]);
    const [travelBudget, setTravelBudget] = useState<string | null>(null);

    const next = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    const back = () => setStep((prev) => Math.max(prev - 1, 1));

    // Basic validation per-step. Tweak rules here.
    const isValidEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e);

    const canContinue = useMemo(() => {
        if (step === 1) {
            // require name, valid email, 10-digit phone, birthDate and gender
            return (
                fullName.trim().length > 1 &&
                isValidEmail(email) &&
                phoneNumber.trim().length === 10 &&
                birthDate.trim().length > 0 &&
                gender.trim().length > 0
            );
        }
        // steps 2..4 currently no required fields
        else if (step === 2) {
            return (
                profilePhoto != null
            );
        }
        else if (step === 3) {
            
            return travelPreferences.length > 0 && travelBudget !== null;
        }
        return true;
    }, [step, fullName, email, phoneNumber, birthDate, gender, profilePhoto, travelPreferences, travelBudget]);

    const handleContinue = async () => {
        if (!canContinue) {
            Alert.alert("Incomplete", "Please fill required fields on this step.");
            return;
        }

        if (step < TOTAL_STEPS) {
            setStep((s) => s + 1);
            return;
        }

        // final submit
        const payload = {
            fullName,
            email,
            phoneNumber,
            birthDate,
            gender,
            languagesSelected,
            bio,
            instagram,
            // profilePhoto is included so you can upload if needed
            profilePhoto,
        };

        console.log("Submitting profile:", payload);
        Alert.alert("Submitted", "Profile submitted successfully.");

        // If you want to upload as multipart/form-data replace above with fetch/axios call.
    };

    return (
        <View style={styles.container}>
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
            selectedLanguages={languagesSelected}
            setSelectedLanguages={setLanguagesSelected}
          />
        )}
                {step === 2 && <ProfilePhotoScreen profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />}
                {step === 3 && (
                <TravelPreferencesScreen
                    travelPreferences={travelPreferences}
    setTravelPreferences={setTravelPreferences}
    travelBudget={travelBudget}
    setTravelBudget={setTravelBudget}
                />
                )}
                {step === 4 && <MatchPreferencesScreen />}

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
                        <Text style={utilityStyles.continueButtonText}>{step === TOTAL_STEPS ? "Submit" : "Next"}</Text>
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
    selectedLanguages,
    setSelectedLanguages,
}) => {
    const [languages, setLanguages] = useState<string[]>(["English", "Hindi", "Punjabi", "Tamil"]);
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
            <TextInput placeholder="Enter your name" style={styles.input} value={fullName} onChangeText={setFullName} />

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
                    <Image source={require("../../assets/images/indiaFlag.png")} style={styles.flag} />
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
            <TextInput placeholder="Enter Birth Date (DD/MM/YYYY)" style={styles.input} value={birthDate} onChangeText={setBirthDate} />

            <Text style={styles.inputLabel}>
                Gender<Text style={{ color: COLORS.error[1] }}> *</Text>
            </Text>

            {/* Picker-based gender selection (better UX than free text) */}
            <View style={[styles.input, { display: "flex", padding: 0, overflow: "hidden" }]}>
                <Picker selectedValue={gender} onValueChange={(val) => setGender(val)} style={{ height: 50 }}>
                    <Picker.Item label="Select gender..." value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Prefer not to say" value="prefer_not_say" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>
                Languages You Speak<Text style={{ color: COLORS.error[1] }}> *</Text>
            </Text>
            <View style={{ display: "flex", alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" }}>
                <TextInput placeholder="Choose below or type" value={newLang} onChangeText={setNewLang} style={[styles.input, { width: "80%", marginBottom: 15 }]} />
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
                            <Text style={{ color: isSelected ? "#fff" : COLORS.secondary[1], fontWeight: "500" }}>{lang}</Text>
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
    const imageOptions: ImageLibraryOptions = { mediaType: "photo" as MediaType, maxWidth: 1024, maxHeight: 1024, quality: 0.8 };
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
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: "Camera Permission",
                    message: "We need access to your camera to take a photo.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                });
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
        console.log("Upload button pressed");
        setSheetVisible(true);
    };

    return (
        <View style={{ flex: 1, marginTop: 30 }}>
            <Text style={styles.title}>Profile Photo</Text>
            <Text style={styles.subtitle}>Add a photo to get more matches</Text>

            <View style={styles.uploadPhotoContainer}>
                <Pressable style={styles.uploadPhotoPressableContainer} onPress={onUploadPress} accessibilityRole="button">
                    {!profilePhoto ? (
                        <View style={styles.cameraPlusIconBox}>
                            <Image source={require("../../assets/images/camera-plus.png")} />
                        </View>
                    ) : null}

                    {profilePhoto ? (
                        <Image
                            source={{ uri: profilePhoto.uri }}
                            style={{ width: 96, height: 96, borderRadius: 48 }}
                        />
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
      <View style={{marginBottom:40}}>
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

const MatchPreferencesScreen = () => {
    const travelWith = [
        "Anyone",
        "Friends",
        "Family",
        "Partner",
        ];
        const ageCat = [
            "Anyone",
            "18-25",
            "26-35",
            "36-50",
            "50+"
        ];
    const [selectedTravelWith, setSelectedTravelWith] = useState<string[]>(['Anyone']);
    const toggleSelectTravelWith = (travel: string) => {
        if (selectedTravelWith.includes(travel)) {
            setSelectedTravelWith(selectedTravelWith.filter((t) => t !== travel));
        } else {
            setSelectedTravelWith([...selectedTravelWith, travel]);
        }
    };
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string[]>(['Anyone']);
    const toggleSelectAgeGroup = (age: string) => {
        if (selectedAgeGroup.includes(age)) {
            setSelectedAgeGroup(selectedAgeGroup.filter((a) => a !== age));
        } else {
            setSelectedAgeGroup([...selectedAgeGroup, age]);
        }
    };
    return(<View style={{ flex: 1, marginTop: 30 }}>
      <Text style={styles.title}>Match Preferences</Text>
      <Text style={[styles.subtitle, { marginBottom: 30 }]}>
        Tell us who you’d love to travel with.
      </Text>
      <Text style={styles.labelTitle}>Who would you like to travel with? *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {travelWith.map((travel, index) => {
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
                            <Text style={{ color: isSelected ? "#fff" : COLORS.secondary[1], fontWeight: "500" }}>{travel}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
      <Text style={styles.labelTitle}>Preferred age group for travel buddies *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {ageCat.map((age, index) => {
                    const isSelected = selectedAgeGroup.includes(age);
                    return (
                        <Pressable
                            key={index}
                            onPress={() => toggleSelectAgeGroup(age)}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isSelected ? COLORS.primary[1] : COLORS.base.white,
                                    borderColor: isSelected ? COLORS.primary[1] : COLORS.neutral[1],
                                },
                            ]}
                        >
                            <Text style={{ color: isSelected ? "#fff" : COLORS.secondary[1], fontWeight: "500" }}>{age}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
      <Text style={styles.labelTitle}>Favourite travel destinations *</Text>
      <Text style={styles.labelTitle}>Your travel goal *</Text>
      <Text style={styles.labelTitle}>Privacy</Text>
    </View>
)};

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
});

export default ProfileBuilding;
