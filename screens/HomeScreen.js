import {  StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          Modal, 
          TextInput, 
          KeyboardAvoidingView, 
          ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { format } from 'date-fns';
import {useFonts} from 'expo-font';
import usersPro from '../reducers/usersPro';
import { useSelector } from 'react-redux';

const BACKEND_ADDRESS = 'http://10.1.3.185:3000';

export default function HomeScreen({ navigation }) {

// Retrouver le token du user connecté
  const user = useSelector((state) => state.usersPro.value)
// Events infos
  const [eventsInfos, setEventsInfos] = useState([]);
  const [eventsFound, setEventsFound] = useState(null);
// New event
  const [isNewEventCreated, setIsNewEventCreated] = useState(false);
// Delete event
  const [eventId, setEventId] = useState('');
// Modal to create an event
  const [modalVisible, setModalVisible] = useState(false);
// Event Title
  const [title, setTitle] = useState('');
// Date selection
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [isDatePickerEndVisible, setDatePickerEndVisibility] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
// Recurrence selection
  const [selectedRecurrence, setSelectedRecurrence] = useState(null);
  const [selectedRecurrenceText, setSelectedRecurrenceText] = useState('');
// Checkbox event or promo
  const [isCheckedEvent, setCheckedEvent] = useState('');
  const [isCheckedPromotion, setCheckedPromotion] = useState('');
// Event Title
  const [description, setDescription] = useState('');
// Style des inputs
  const [isFocused, setIsFocused] = useState(false)
// Import Font Quicksand
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf')
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

  // Delete the event
  const handleDelete = (eventId) => {
    setEventId(eventId);
    fetch(`${BACKEND_ADDRESS}/events/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: eventId }), 
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        console.log('Event deleted successfully');
        setIsNewEventCreated(true);
        // setIsNewEventCreated permet de reload la page des events (même fonction que lorsqu'on crée un event)
      } else {
        console.log('Event not found or already deleted');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
    
  // Events import 
  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Data from server:", data);
      if (data.result) {
        setEventsInfos(data.events);
        if (data.events && data.events.length > 0) {
          setEventsFound(true);
        } else {
          setEventsFound(false);
        }
      } else {
        setEventsFound(false);
      }
    })
    .finally(() => {
      setIsNewEventCreated(false);
    });
  }, [isNewEventCreated]);

  if (!fontsLoaded) {
    return null
  }

  let display;
  if (eventsFound) {
    console.log('Events found:', eventsFound)
    display = (
    <ScrollView style={styles.events}>
      {eventsInfos.map((event, index) => (
      <View key={index}>
        <View style={styles.eventCard}>
        <View style={styles.eventInfos}>
          <Text style={styles.title}>Titre:</Text>
          <Text style={styles.eventInfos}>{event.title}</Text>
            </View>
            <View style={styles.eventInfos}>
              <Text style={styles.title}>Date:</Text>
              <Text style={styles.eventInfos}>du {format(new Date(event.startTime), 'dd/MM/yy HH:mm')} au {format(new Date(event.endTime), 'dd/MM/yy HH:mm')}</Text>
            </View>
            <View style={styles.eventInfos}>
              <Text style={styles.title}>Récurrence:</Text>
              <Text style={styles.eventInfos}>{event.recurrence}</Text>
            </View>
            <View style={styles.eventInfos}>
              <Text style={styles.title}>Type:</Text>
              <Text style={styles.eventInfos}>
                {event.eventType.includes('Evènement') && event.eventType.includes('Promotion')
                ? 'Evènement Promotion' : event.eventType.join(' ')}
              </Text>
            </View>
            <View style={styles.eventInfos}>
              <Text style={styles.title}>Description:</Text>
              <Text style={styles.eventInfos}>{event.description}</Text>
            </View>
            <View style={styles.updateEvent}>
            <TouchableOpacity
                style={styles.buttonUpdate}
                activeOpacity={0.8}
                onPress={() => handleDelete(event._id)}>
              <Text style={styles.textButtonUpdate}>
                Supprimer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonUpdate}
                activeOpacity={0.8}
                onPress={() => {}}>
              <Text style={styles.textButtonUpdate}>
                Modifier
              </Text>
            </TouchableOpacity>
            </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  } else {
    console.log('No events found')
    display = (
      <View style={styles.none}>
        <Text style={styles.noneText}>
          Aucun évènement en cours
        </Text> 
      </View>
    );
  }

  // Submit the event 
  const handleSubmit = () => {
    fetch(`${BACKEND_ADDRESS}/events/create`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: title, 
        startTime: selectedStartDate, 
        endTime: selectedEndDate, 
        recurrence: selectedRecurrence, 
        eventType: [isCheckedEvent, isCheckedPromotion], 
        description: description,
        token: user,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
      setIsNewEventCreated(true);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }


  return (

    <View style={styles.container}>

      <Text style={styles.h2}>Mes évènements</Text>

      {display}

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
                  setSelectedRecurrence(value);
                  setSelectedRecurrenceText(value ? options.find(option => option.value === value).label : '');
                }}
                  value={selectedRecurrence}
                  >
                <TextInput
                  placeholder='Récurrence'
                  style={styles.input} 
                  editable={false}
                  value={selectedRecurrenceText} 
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
                  onValueChange={() => setCheckedEvent(isCheckedEvent === '' ? 'Evènement' : '')}
                  color={isCheckedEvent !== '' ? '#1E98EF' : undefined}
                  />
              <Text>
                Promotion :
              </Text>
              <Checkbox
                  style={styles.checkbox}
                  value={isCheckedPromotion}
                  onValueChange={() => setCheckedPromotion(isCheckedPromotion === '' ? 'Promotion' : '')}
                  color={isCheckedPromotion !== '' ? '#1E98EF' : undefined}
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
                onPress={() => {
                  setModalVisible(false)
                  handleSubmit()}}>
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
    marginBottom: 30,
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

  events: {
    width: '90%',
    flexDirection: 'column',
    marginBottom: 10,

  },
  eventCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D7D7E5',
    borderRadius: 5,
    marginBottom: 9,
    padding: 8,

  },
  title: {
    fontFamily: 'Quicksand-SemiBold',
    fontSize: 16,
  },
  eventInfos: {
    flexDirection: 'row',
    fontFamily: 'Quicksand-Regular',
    fontSize: 15,
    marginLeft: 5,
    width: 265,
  },
  buttonUpdate: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#8440B4',
    marginBottom: 5,
    height: 35,
    width: 155,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginRight: 5,
  },
  textButtonUpdate: {
    color: '#8440B4',
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  updateEvent: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
  
});
