// UploadBottomSheet.tsx
// Modern, accessible bottom-sheet for picking or taking a profile photo.
// Built for React Native (TypeScript). Uses gorhom bottom-sheet + reanimated + gesture-handler.
//
// INSTALL (App-level):
// yarn add @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler @expo/vector-icons (for Expo)
// or expo install react-native-gesture-handler react-native-reanimated @expo/vector-icons
// Follow @gorhom/bottom-sheet and react-native-reanimated setup instructions (babel plugin + Reanimated config).
//
// FEATURES:
// - image preview when photo exists
// - primary actions: Take Photo, Choose from Library
// - contextual action: Remove Photo (if present)
// - pan-to-close, backdrop close
// - modern rounded UI with small drag handle
// - accessible touch targets and hitSlop
//
// USAGE (example shown here as a comment):
// import UploadBottomSheet from './UploadBottomSheet';
// const [sheetVisible, setSheetVisible] = useState(false);
// <UploadBottomSheet
//   visible={sheetVisible}
//   onClose={() => setSheetVisible(false)}
//   onTakePhoto={handleTakePhoto}
//   onChooseFromLibrary={handleChooseFromLibrary}
//   onRemovePhoto={() => setProfilePhoto(null)}
//   profilePhoto={profilePhoto}
// />
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';

type Asset = { uri?: string; fileName?: string; type?: string; width?: number; height?: number };

interface Props {
  visible?: boolean;
  onClose?: () => void;
  onTakePhoto: () => void | Promise<void>;
  onChooseFromLibrary: () => void | Promise<void>;
  onRemovePhoto?: () => void;
  profilePhoto?: Asset | null;
  initialSnap?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function UploadBottomSheet({
  visible = false,
  onClose,
  onTakePhoto,
  onChooseFromLibrary,
  onRemovePhoto,
  profilePhoto = null,
  initialSnap = 0,
}: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);  // Smaller for compact, modern feel

  useEffect(() => {
    if (visible) {
      console.log("Opening upload sheet");
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const closeSheet = useCallback(() => {
    sheetRef.current?.dismiss();
    onClose?.();
  }, [onClose]);

  const handleTakePhotoTap = useCallback(async () => {
    try {
      await onTakePhoto();
    } catch (err) {
      console.warn('take photo handler error', err);
    }
    closeSheet();
  }, [onTakePhoto, closeSheet]);

  const handleChooseFromLibraryTap = useCallback(async () => {
    try {
      await onChooseFromLibrary();
    } catch (err) {
      console.warn('choose from library handler error', err);
    }
    closeSheet();
  }, [onChooseFromLibrary, closeSheet]);

  const handleRemoveTap = useCallback(() => {
    onRemovePhoto?.();
    closeSheet();
  }, [onRemovePhoto, closeSheet]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={initialSnap}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture
      onDismiss={() => onClose?.()}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        //   opacity={0.3}
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}

        />
      )}
      handleIndicatorStyle={styles.handle}
      style={styles.sheet}
    >
      <BottomSheetView style={styles.wrapper}>
        <View style={styles.topRow}>
          <View style={styles.drag} />
        </View>

        {/* Preview
        <View style={styles.previewArea}>
          {profilePhoto && profilePhoto.uri ? (
            <>
              <Image source={{ uri: profilePhoto.uri }} style={styles.previewImage} />
              <Text style={styles.previewLabel}>Current photo</Text>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Icon name="image-outline" size={42} color="#666" />
              <Text style={styles.placeholderText}>No photo</Text>
            </View>
          )}
        </View> */}

        {/* Actions list - Now horizontal for modern, compact layout */}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={handleTakePhotoTap}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Take a photo"
          >
            <View style={styles.iconCircle}>
              <Icon name="camera" size={32} color="#333" />  {/* Larger for prominence */}
            </View>
            <Text style={styles.actionTitle}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={handleChooseFromLibraryTap}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Choose from library"
          >
            <View style={styles.iconCircle}>
              <Icon name="images" size={32} color="#333" />
            </View>
            <Text style={styles.actionTitle}>Gallery</Text>
          </TouchableOpacity>

          {!!profilePhoto && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={handleRemoveTap}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <View style={[styles.iconCircle, styles.removeIcon]}>
                <Icon name="trash" size={28} color="#D23F44" />
              </View>
              <Text style={[styles.actionTitle, styles.removeText]}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={closeSheet} accessibilityRole="button">
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, !profilePhoto && styles.primaryButtonGhost]}
            onPress={() => closeSheet()}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>{profilePhoto ? 'Use Photo' : 'Done'}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 180,  // Smaller min height for compact design
  },
  topRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  drag: {
    width: 48,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#E6E6E6',
  },
  previewArea: {
    alignItems: 'center',
    marginBottom: 14,
  },
  previewImage: {
    width: 88,
    height: 88,
    borderRadius: 88,
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#333',
  },
  placeholder: {
    width: 88,
    height: 88,
    borderRadius: 88,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',  // Horizontal row
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  actionButton: {  // Renamed from actionRow; now column for icon above label
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,  // Fixed width for even spacing
    paddingVertical: 8,
    borderRadius: 12,
  },
  iconCircle: {
    width: 50,  // Slightly larger
    height: 50,
    borderRadius: 25,  // More rounded for modern feel
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,  // Space between icon and label
  },
  removeIcon: {
    backgroundColor: '#FFF0F0',
  },
  actionTitle: {
    fontSize: 14,  // Smaller for labels
    color: '#111',
    fontWeight: '500',
  },
  removeText: {
    color: '#D23F44',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  cancelText: {
    color: '#666',
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#0A84FF',  // Travel-blue for adventure vibe
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  primaryButtonGhost: {
    backgroundColor: '#E6F0FF',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  handle: {
    backgroundColor: 'transparent',
  },
});