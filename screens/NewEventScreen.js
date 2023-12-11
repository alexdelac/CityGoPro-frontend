import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function NewEventScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={styles.h2}>Nouvel évènement</Text>
        <TextInput placeholder='Titre de ton évènement' style={styles.input} />
        <TextInput placeholder='Date et heure de début' style={styles.input} />
        <TextInput placeholder='Date et heure de fin' style={styles.input} />
        <TextInput placeholder='Récurrence' style={styles.input} />
        <TextInput placeholder='Description' style={styles.inputLarge} />
        <TouchableOpacity onPress={() => navigation.navigate('NewEvent')} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Créer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    h2: {
      fontSize: 36,
      color: '#FF7337',
      fontWeight: 'bold',
      marginTop: 90,
    },
    input: {

    },
    inputLarge: {

    },
    button: {
      backgroundColor: '#8440B4',
      borderRadius: 50,
      height: 50,
      width: 285,
      justifyContent: 'center',
      alignItems: 'center'

    },
    textButton: {
      color: 'white',
      fontSize: 24,
    },
  });

//   import { createSlice } from '@reduxjs/toolkit';


// const initialState = {
//   value: { nickname: null, places: [] },
// };

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     updateNickname: (state, action) => {
//       state.value.nickname = action.payload;
//     },
//     addPlace: (state, action) => {
//       state.value.places.push(action.payload);  
//     },
//     removePlace: (state, action) => {
//       state.value.places = state.value.places.filter(e => e.name !== action.payload);
//     },
//     importPlaces: (state, action) => {
//       state.value.places = action.payload;
//     },
//   },
// });

// export const { updateNickname, addPlace, removePlace, importPlaces } = userSlice.actions;
// export default userSlice.reducer;