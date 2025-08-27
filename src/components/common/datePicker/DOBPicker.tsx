import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from "../../../constants";

type Props = {
  value: string; // DD/MM/YYYY
  onChange: (v: string) => void;
  minAge?: number; // e.g. 18
  placeholder?: string;
  label?: string;
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

const calculateAge = (dob: Date) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const parseDDMMYYYY = (s: string) => {
  const [dStr, mStr, yStr] = s.split("/");
  return new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
};

export default function DOBPicker({ value, onChange, minAge = 0, placeholder = "Select birth date", label = "Birth Date" }: Props) {
  const [visible, setVisible] = useState(false);

  const maxDate = useMemo(() => new Date(), []); // today
  const minDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120); // 120 years ago
    return d;
  }, []);

  const currentAge = useMemo(() => {
    try {
      if (!value) return null;
      const dt = parseDDMMYYYY(value);
      return calculateAge(dt);
    } catch {
      return null;
    }
  }, [value]);

  const onConfirm = (date: Date) => {
    // guard: future
    if (date > new Date()) {
      Alert.alert("Invalid date", "Birth date cannot be in the future.");
      setVisible(false);
      return;
    }

    const age = calculateAge(date);
    if (minAge && age < minAge) {
      Alert.alert("Too young", `You must be at least ${minAge} years old.`);
      setVisible(false);
      return;
    }

    onChange(formatDate(date));
    setVisible(false);
  };

  return (
    <View>
      {/* <Text style={styles.label}>
        {label}
        {minAge > 0 ? <Text style={{ color: "#E53935" }}> *</Text> : null}
      </Text> */}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label} picker`}
      >
        <Text style={{ color: value ? "#000" : "#999" }}>{value || placeholder}</Text>
      </TouchableOpacity>

      {/* {currentAge !== null && (
        <Text style={styles.ageText}>Age: {currentAge} {currentAge < minAge ? `(min ${minAge})` : ""}</Text>
      )} */}

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={onConfirm}
        onCancel={() => setVisible(false)}
        maximumDate={maxDate}
        minimumDate={minDate}
        display={Platform.OS === "ios" ? "spinner" : "default"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
          borderWidth: 2,
          borderColor: COLORS.primary[1] + "AF",
          height: 50,
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
          fontSize: 15,
      },
});
