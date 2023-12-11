import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Mes évènements</Text>
      <View style={styles.none}>
        <Text style={styles.noneText}>Aucun évènement en cours</Text>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Créer un évènement</Text>
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
         <KeyboardAvoidingView style={styles.modal} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalView}>
          <Text style={styles.h2Modal}>Nouvel évènement</Text>
        <TextInput placeholder='Titre de ton évènement' style={styles.input} />
        <TextInput placeholder='Date et heure de début' style={styles.input} />
        <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
        <TextInput placeholder='Date et heure de fin' style={styles.input} />
        <View style={styles.sectionCheckbox}>
          <Text>Evènement :</Text>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#D3CCD8' : undefined}
            />
          <Text>Promotion :</Text>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#D3CCD8' : undefined}
            />
        </View>
        <TextInput placeholder='Description' style={styles.inputLarge} />
            <TouchableOpacity
              style={styles.button1}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textButton1}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textButton2}>Retour</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    color: '#FF7337',
    fontWeight: 'bold',
    marginTop: 90,
  },
  h2Modal: {
    fontSize: 36,
    color: '#FF7337',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#8440B4',
    borderRadius: 50,
    marginBottom: 20,
    height: 50,
    width: 285,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 24,
  },
  button1: {
    backgroundColor: '#8440B4',
    borderRadius: 50,
    marginBottom: 0,
    height: 50,
    width: 285,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  textButton1: {
    color: 'white',
    fontSize: 24,
  },
  button2: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#8440B4',
    marginBottom: 5,
    height: 50,
    width: 285,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
  },
  textButton2: {
    color: '#8440B4',
    fontSize: 24,
  },
  none: {
    backgroundColor: '#F4F4F3',
    padding: 20,
    color: '#D3CCD8',
    borderRadius: 5,
  },
  noneText: {
    color: '#D3CCD8',
    fontStyle: 'italic',
    fontSize: 20,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5, // Effet d'élévation pour Android
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
  input: {
    width: 285,
    height: 55,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginTop: 9,
    paddingLeft: 9,
  },
  inputLarge: {
    width: 285,
    height: 160,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginTop: 9,
    paddingLeft: 9,
  },
  checkbox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginRight: 30,
    marginLeft: 5,
  },
  sectionCheckbox: {
    flexDirection: 'row',
    marginTop: 9,
  }
});
