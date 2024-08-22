import ThemedIcon from '@/components/theme/ThemedIcon';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import CategoryList from '../../components/CategoryList';
import InfusionCard from '../../components/InfusionCard';
import { ThemedText } from '../../components/theme/ThemedText';
import ThemedTextInput from '../../components/theme/ThemedTextInput';
import { ThemedView } from '../../components/theme/ThemedView';
import { defaultCategoryId, useTimers } from '../../context/timersContext';

export default function CreateTimerScreen() {
  const { addTimer } = useTimers();

  const navigation = useNavigation();
  const router = useRouter();

  const { categoryId: preSelectedCategoryId } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [infusions, setInfusions] = useState<number[]>([0]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    preSelectedCategoryId as string
  );

  if (!selectedCategoryId) {
    throw new Error('Category id is required');
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <ThemedText>Save</ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, title, selectedCategoryId, infusions]);

  const handleSave = () => {
    if (!title || infusions.length === 0) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const timer = {
      title,
      infusions,
      id: Math.random().toString(36).substring(7),
    };

    addTimer(selectedCategoryId, timer);

    // Determine the appropriate route based on the category selection
    if (selectedCategoryId === preSelectedCategoryId) {
      // If the category is unchanged, just go back to the previous screen
      router.back();
    } else if (selectedCategoryId === defaultCategoryId) {
      // If the category was changed to the default category
      router.replace(`/timers`);
    } else {
      // If the category was changed to another custom category
      router.replace(`/category/${selectedCategoryId}`);
    }
  };

  const handleDurationChange = (index: number, value: number) => {
    const newInfusions = [...infusions];
    newInfusions[index] = value;
    setInfusions(newInfusions);
  };

  const handleCategorySelection = (categoryId: string) => {
    if (categoryId === selectedCategoryId) {
      setSelectedCategoryId(defaultCategoryId);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  const handleAddInfusion = () => {
    setInfusions([...infusions, 0]);
  };

  const handleDeleteInfusion = (index: number) => {
    const newInfusions = [...infusions];
    newInfusions.splice(index, 1);
    setInfusions(newInfusions);
  };

  return (
    <ThemedView style={styles.pageContainer}>
      <ScrollView>
        <View>
          <ThemedTextInput
            value={title}
            onChangeText={setTitle}
            label="Name"
            style={{}}
            placeholder="e.g. Sencha"
          />
          <View style={styles.categoryList}>
            <ThemedText>Category</ThemedText>
            <CategoryList
              selectedCategoryId={selectedCategoryId}
              handleCategorySelection={handleCategorySelection}
            />
          </View>
          <View style={styles.infusionList}>
            <ThemedText>Infusions</ThemedText>
            {infusions.map((duration, index) => (
              <InfusionCard
                key={index}
                index={index}
                duration={duration}
                onDurationChange={handleDurationChange}
                deleteInfusion={handleDeleteInfusion}
              />
            ))}
          </View>
          <View style={styles.addInfusionIconWrapper}>
            <Pressable onPress={handleAddInfusion}>
              <ThemedIcon name="add-circle" size={56} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    minHeight: '100%',
    padding: 8,
  },
  categoryList: {
    marginTop: 16,
    display: 'flex',
    gap: 8,
  },
  infusionList: {
    marginTop: 16,
    display: 'flex',
    gap: 8,
  },
  addInfusionIconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 32,
  },
});
