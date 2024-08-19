import { useRef } from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import ThemedIcon from './ThemedIcon';
import { ThemedText } from './ThemedText';
import ThemedTextInput from './ThemedTextInput';
import { ThemedView } from './ThemedView';

interface InfusionCardProps {
  index: number;
  duration: number;
  onDurationChange: (index: number, value: number) => void;
  deleteInfusion: (index: number) => void;
}

export default function InfusionCard({
  index,
  duration,
  onDurationChange,
  deleteInfusion,
}: InfusionCardProps) {
  const cardBackgroundColor = useThemeColor('card');
  const accent = useThemeColor('accent');

  const durationInputRef = useRef<RNTextInput>(null);

  const handleDurationInputFocus = () => {
    const input = durationInputRef.current;
    if (input) {
      input.focus();
      input.setNativeProps({
        selection: { start: 0, end: duration.toString().length },
      });
    }
  };

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: cardBackgroundColor, borderColor: accent },
      ]}
    >
      <ThemedText>{index + 1}. Infusion</ThemedText>
      <View style={styles.durationWrapper}>
        <ThemedTextInput
          style={styles.durationValue}
          inputMode="numeric"
          value={duration.toString()}
          onChangeText={value => onDurationChange(index, +value)}
          onFocus={handleDurationInputFocus}
          ref={durationInputRef}
          maxLength={3}
        />
        <ThemedText>Seconds</ThemedText>
      </View>

      <ThemedIcon
        name="trash"
        size={24}
        onPress={() => deleteInfusion(index)}
        style={styles.deleteButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationValue: { width: 58, textAlign: 'center' },
  deleteButton: {
    padding: 12,
  },
});