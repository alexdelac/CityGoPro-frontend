import { StyleSheet, Text, View } from 'react-native';

export default function NewEventScreen() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text stye={styles.h2}>Nouvel évènement</Text>
        <TextInput placeholder='Titre de ton évènement' style={styles.input} />
        <TextInput placeholder='Date et heure de début' style={styles.input} />
        <TextInput placeholder='Date et heure de fin' style={styles.input} />
        <TextInput placeholder='Récurrence' style={styles.input} />
        <TextInput placeholder='Description' style={styles.inputLarge} />
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
    h2: {

    },
    input: {

    },
    inputLarge: {

    }
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