import { StyleSheet, Text, View } from 'react-native';

export default function HistoricalScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.h2}>Historique</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    h2: {
      fontSize: 36,
      color: '#1E98EF',
      fontFamily: 'Quicksand-Bold',
      marginTop: 90,
      marginBottom: 30,
    },
  });