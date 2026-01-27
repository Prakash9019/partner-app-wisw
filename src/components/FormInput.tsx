import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONTS } from '../utils/theme';

interface FormInputProps extends TextInputProps {
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholderTextColor="#666" 
          {...props} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1A1A1A', // Dark Gray background from image
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12, // Increased height
  },
  input: {
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});

export default FormInput;