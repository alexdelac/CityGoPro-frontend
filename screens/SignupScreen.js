import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { addToken } from '../reducers/usersPro'
import {useFonts} from 'expo-font'

export default function SignupScreen({navigation}) {
  const [lastName, setLastName] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [errorPassword, setErrorPassword]= useState(false)
  const [errorSignup, setErrorSignup]= useState(null)
  const [isFocused, setIsFocused]= useState(false)
  const dispatch = useDispatch()

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });

  if(!fontsLoaded){
    return null
  }


function handleSubmit() {
  
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (password === confirmPassword && pattern.test(email)){ // vérfie si password et email valide
      fetch('http://10.1.1.30:3000/usersPro/signup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({lastName, firstName, phoneNumber, email, password, confirmPassword}),
      })
        .then(response=>response.json())
        .then(data=>{
          console.log(data)
          if (data.result){
           dispatch(addToken(data.token)) // enregistre le token dans le réducer
            navigation.navigate('TabNavigator', {screen: 'Evenements'})
          } else {
            setErrorSignup(data.error) // enregistre pour affichage le message d'érreur renvoyé par le back
          }
          
        })
    } else {
      setErrorPassword(true) // change le state pour affichage message d'érreur si invalid email ou password non identique
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  Keyboard.dismiss() // retire l'affichage du clavier
}

    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Inscription</Text>
        <View >
          {isFocused === 'Nom' && <Text style={styles.inputLabel}>Nom</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('Nom')} 
              onBlur={()=>setIsFocused(false)} 
              value={lastName} 
              onChangeText={(value)=>setLastName(value)} 
              style={[styles.input, isFocused === 'Nom' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'Nom' ? '' : 'Nom'}
          />
          {isFocused === 'Prénom' && <Text style={styles.inputLabel}>Prénom</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('Prénom')} 
              onBlur={()=>setIsFocused(false)} 
              value={firstName} 
              onChangeText={(value)=>setFirstName(value)} 
              style={[styles.input, isFocused === 'Prénom' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'Prénom' ? '' : 'Prénom'}
          />
          {isFocused === 'Téléphone' && <Text style={styles.inputLabel}>Téléphone</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('Téléphone')} 
              onBlur={()=>setIsFocused(false)} 
              inputMode='tel' 
              value={phoneNumber} 
              onChangeText={(value)=>setPhoneNumber(value)} 
              style={[styles.input, isFocused === 'Téléphone' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'Téléphone' ? '' : 'Téléphone'}
          />
          {isFocused === 'E-mail' && <Text style={styles.inputLabel}>E-mail</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('E-mail')} 
              onBlur={()=>setIsFocused(false)}  
              autoCapitalize='none' 
              value={email} 
              onChangeText={(value)=>setEmail(value)} 
              style={[styles.input, isFocused === 'E-mail' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'E-mail' ? '' : 'E-mail'}
          />
          {isFocused === 'Mot de passe' && <Text style={styles.inputLabel}>Password</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('Mot de passe')} 
              onBlur={()=>setIsFocused(false)} 
              autoCapitalize='none' 
              secureTextEntry={true} 
              value={password} 
              onChangeText={(value)=>setPassword(value)} 
              style={[styles.input, isFocused === 'Mot de passe' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'Mot de passe' ? '' : 'Mot de passe'}
          />
          {isFocused === 'Confirmation mot de passe' && <Text style={styles.inputLabel}>Confirm</Text>}
          <TextInput 
              onFocus={()=>setIsFocused('Confirmation mot de passe')} 
              onBlur={()=>setIsFocused(false)} 
              autoCapitalize='none' 
              secureTextEntry={true} 
              value={confirmPassword} 
              onChangeText={(value)=>setConfirmPassword(value)} 
              style={[styles.input, isFocused === 'Confirmation mot de passe' && styles.inputIsFocused]} 
              placeholderTextColor={'#D7D7E5'} 
              placeholder={isFocused === 'Confirmation mot de passe' ? '' : 'Confirmation mot de passe'}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>handleSubmit()}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
        {errorPassword && <Text>Email non valide ou mot de passe non identique</Text>}
        {errorSignup && <Text>{errorSignup}</Text>}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('Signin')}>
              <Text style={styles.linkText}> Connecte-toi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
    },

    title:{
      color: '#1E98EF',
      fontSize: 36,
      fontFamily: 'Quicksand-Bold',
      marginTop: 25
    },

  

    input: {
      borderWidth: 1,
      borderColor: '#D7D7E5',
      borderRadius: 5,
      width: 285,
      height: 55,
      margin: 5,
      paddingLeft: 20,
    },

    inputIsFocused: {
      borderColor: '#1E98EF',
    },

    inputLabel: {
      position: 'relative',
      color: '#1E98EF',
      textAlign: 'center',
      width: 70,
      marginBottom: -14,
      marginLeft: 20,
      backgroundColor: 'white',
      zIndex: 1,
    },

    button: {
      width: 285,
      height: 50,
      backgroundColor: '#8440B4',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      color: 'white',
      fontSize: 24,
      fontFamily: 'Quicksand-SemiBold'
    }, 

    textContainer: {
      flexDirection: 'row',
      
    },

    text: {
      fontSize: 16,
      fontFamily: 'Quicksand-Bold',
    },

    linkText: {
      color: '#1E98EF',
      fontSize: 16,
      fontFamily: 'Quicksand-Bold'
    }

    
  });