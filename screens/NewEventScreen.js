import { StyleSheet, Text, View } from 'react-native';

export default function NewEventScreen() {
    return (
      <View style={styles.container}>
        <Text>New Event</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });