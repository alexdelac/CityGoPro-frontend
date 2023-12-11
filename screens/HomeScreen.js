import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

export default function HomeScreen({ navigation }) {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isCheckedEvent, setCheckedEvent] = useState(false);
  const [isCheckedPromotion, setCheckedPromotion] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("Date sélectionnée: ", date);
    setSelectedStartDate(date);
    setSelectedEndDate(date);
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
        activeOpacity={0.8}>
          <Text style={styles.textButton}>Créer un évènement</Text>
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modale nouvel événement fermée');
          setModalVisible(!modalVisible);
      }}>

      <KeyboardAvoidingView style={styles.modal} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalView}>
          <Text style={styles.h2Modal}>Nouvel évènement</Text>
            <TextInput placeholder='Titre de ton évènement' 
                       style={styles.input} />
            <TextInput placeholder='Date et heure de début' 
                       style={styles.input} 
                       value={selectedStartDate ? format(selectedStartDate, 'dd/MM/yy HH:mm') : ''}/>
            <Button title="Show Date Picker" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            <TextInput placeholder='Date et heure de fin' 
                       style={styles.input} 
                       value={selectedEndDate ? format(selectedEndDate, 'dd/MM/yy HH:mm') : ''}/>
            <Button title="Show Date Picker" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
        <View style={styles.sectionCheckbox}>
          <Text>Evènement :</Text>
            <Checkbox
              style={styles.checkbox}
              value={isCheckedEvent}
              onValueChange={setCheckedEvent}
              color={isCheckedEvent ? '#D3CCD8' : undefined}
            />
          <Text>Promotion :</Text>
            <Checkbox
              style={styles.checkbox}
              value={isCheckedPromotion}
              onValueChange={setCheckedPromotion}
              color={isCheckedPromotion ? '#D3CCD8' : undefined}
            />
        </View>
          <TextInput placeholder='Description' style={styles.inputLarge} />
            <TouchableOpacity
              style={styles.button1}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}>
                <Text style={styles.textButton1}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              activeOpacity={0.8}
              onPress={() => setModalVisible(false)}>
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
