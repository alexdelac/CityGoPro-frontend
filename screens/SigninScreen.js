import { StyleSheet, Text, View } from 'react-native';

export default function SigninScreen() {
    return (
      <View style={styles.container}>
        <Text>Signin</Text>
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