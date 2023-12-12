import {  StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          Modal, 
          TextInput, 
          KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { format } from 'date-fns';
import {useFonts} from 'expo-font';


export default function HomeScreen({ navigation }) {

// Modal to create an event
  const [modalVisible, setModalVisible] = useState(false);
// Event Title
  const [title, setTitle] = useState('');
// Date selection
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isDatePickerEndVisible, setDatePickerEndVisibility] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
// Reccurrence selection
  const [selectedReccurrence, setSelectedReccurrence] = useState(null);
  const [selectedReccurrenceText, setSelectedReccurrenceText] = useState('');
// Checkbox event or promo
  const [isCheckedEvent, setCheckedEvent] = useState(false);
  const [isCheckedPromotion, setCheckedPromotion] = useState(false);
// Event Title
  const [description, setDescription] = useState('');
// Style des inputs
  const [isFocused, setIsFocused] = useState(false)
// Import Font Quicksand
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });

// Start date selection
  const showDatePicker = () => {
        setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
        setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
        console.warn("Date sélectionnée: ", date);
        setSelectedStartDate(date);
        hideDatePicker();
  };

// End date selection
  const showDatePickerEnd = () => {
        setDatePickerEndVisibility(true);
  };
  const hideDatePickerEnd = () => {
        setDatePickerEndVisibility(false);
  };
  const handleConfirmEnd = (date) => {
        console.warn("Date sélectionnée: ", date);
        setSelectedEndDate(date);
        hideDatePickerEnd();
  };

  // Recurrence selection
  const placeholder = {
        label: 'Récurrence',
        value: null,
  };
  const options = [
      { label: 'Jamais', value: 'never' },
      { label: 'Tous les jours', value: 'allDays' },
      { label: 'Toutes les semaines', value: 'allWeeks' },
      { label: 'Tous les mois', value: 'allMonths' },
  ];

  // Submit the event 

 
  // RETURN //
  return (

    <View style={styles.container}>

      <Text style={styles.h2}>Mes évènements</Text>

        <View style={styles.none}>
          <Text style={styles.noneText}>
            Aucun évènement en cours
          </Text> 
        </View>

        <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.button}
            activeOpacity={0.8}>
              <Text style={styles.textButton}>
                Créer un évènement
              </Text>
        </TouchableOpacity>

      <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
      }}>

      <KeyboardAvoidingView 
          style={styles.modal} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <View style={styles.modalView}>
          <Text style={styles.h2Modal}>
                Nouvel évènement
          </Text>
            
            {isFocused === 'Titre de ton évènement' && <Text style={styles.inputLabelTitre}>Titre</Text>}
            <TextInput 
                onChangeText={(value) => setTitle(value)}
                value={title}
                onFocus={()=>setIsFocused('Titre de ton évènement')} 
                onBlur={()=>setIsFocused(false)}  
                placeholder={isFocused === 'Titre de ton évènement' ? '' : 'Titre de ton évènement'}
                style={[styles.input, isFocused === 'Titre de ton évènement' && styles.inputIsFocused]}
                />
            <TextInput 
                placeholder='Date et heure de début' 
                onFocus={showDatePicker}
                value={selectedStartDate ? format(selectedStartDate, 'dd/MM/yy HH:mm') : ''}
                style={styles.input} 
                />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={() => { hideDatePicker(); setIsFocused(false); }}
                locale="fr"
                cancelTextIOS="Annuler" // A voir pour Android
                confirmTextIOS="Confirmer" // A voir pour Android
                />
            <TextInput 
                placeholder='Date et heure de fin' 
                onFocus={showDatePickerEnd}
                value={selectedEndDate ? format(selectedEndDate, 'dd/MM/yy HH:mm') : ''}
                style={styles.input} 
                />
              <DateTimePickerModal
                isVisible={isDatePickerEndVisible}
                mode="datetime"
                onConfirm={handleConfirmEnd}
                onCancel={() => { hideDatePickerEnd(); setIsFocused(false); }}
                locale="fr"
                cancelTextIOS="Annuler" // A voir pour Android
                confirmTextIOS="Confirmer" // A voir pour Android
                />

            <View style={styles.pickerContainer}>
            <RNPickerSelect
                placeholder={placeholder}
                items={options}
                onValueChange={(value) => {
                  setSelectedReccurrence(value);
                  setSelectedReccurrenceText(value ? options.find(option => option.value === value).label : '');
                }}
                  value={selectedReccurrence}>
                <TextInput
                  placeholder='Récurrence'
                  style={styles.input} 
                  editable={false}
                  value={selectedReccurrenceText} 
                  />
            </RNPickerSelect>
            </View>

            <View style={styles.sectionCheckbox}>
              <Text>
                Evènement :
              </Text>
              <Checkbox
                  style={styles.checkbox}
                  value={isCheckedEvent}
                  onValueChange={setCheckedEvent}
                  color={isCheckedEvent ? '#1E98EF' : undefined} 
                  />
              <Text>
                Promotion :
              </Text>
              <Checkbox
                  style={styles.checkbox}
                  value={isCheckedPromotion}
                  onValueChange={setCheckedPromotion}
                  color={isCheckedPromotion ? '#1E98EF' : undefined} 
                  />
              </View>

            
            {isFocused === 'Description' && <Text style={styles.inputLabelDescription}>Description</Text>}
              <TextInput
                  onChangeText={(value) => setDescription(value)}
                  value={description}
                  onFocus={()=>setIsFocused('Description')} 
                  onBlur={()=>setIsFocused(false)}  
                  placeholder={isFocused === 'Description' ? '' : 'Description'}
                  style={[styles.inputLarge, isFocused === 'Description' && styles.inputLargeIsFocused ]}
                  multiline
                  />
            
            
            <TouchableOpacity
                style={styles.button1}
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)}>
              <Text style={styles.textButton1}>
                Créer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.button2}
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)} >
              <Text style={styles.textButton2}>
                Retour
                </Text>
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
    color: '#1E98EF',
    fontFamily: 'Quicksand-Bold',
    marginTop: 90,
  },
  h2Modal: {
    fontSize: 36,
    color: '#1E98EF',
    fontFamily: 'Quicksand-Bold',
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
    fontFamily: 'Quicksand-SemiBold',
    
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
    fontFamily: 'Quicksand-SemiBold',
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
    fontFamily: 'Quicksand-SemiBold',
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
  inputLargeIsFocused: {
    borderColor: '#1E98EF',
  },
  inputIsFocused: {
    borderColor: '#1E98EF',
  },
  inputLabelTitre: {
    position: 'relative',
    color: '#1E98EF',
    textAlign: 'center',
    width: 35,
    marginBottom: -14,
    marginLeft: -220,
    backgroundColor: 'white',
    zIndex: 1,
  },
  inputLabelDescription: {
    position: 'relative',
    color: '#1E98EF',
    textAlign: 'center',
    width: 85,
    marginBottom: -14,
    marginLeft: -170,
    backgroundColor: 'white',
    zIndex: 1,
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
  },
  pickerContainer: {
    width: 285,
    marginTop: 0,
  },
  
});
