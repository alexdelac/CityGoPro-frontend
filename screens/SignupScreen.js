import { StyleSheet, Text, View } from 'react-native';

export default function SignupScreen({navigation}) {
    return (
      <View style={styles.container}>
        <Text onPress={()=>navigation.navigate('TabNavigator')}>Signup</Text>
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