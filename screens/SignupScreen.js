import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { addToken } from '../reducers/usersPro'

export default function SignupScreen({navigation}) {
  const [lastName, setLastName] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [errorPassword, setErrorPassword]= useState(false)
  const [errorSignup, setErrorSignup]= useState(null)
  const dispatch = useDispatch()

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
    }
  Keyboard.dismiss() // retire l'affichage du clavier
}

    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Inscription</Text>
        <View>
          <TextInput value={lastName} onChangeText={(value)=>setLastName(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='Nom'/>
          <TextInput value={firstName} onChangeText={(value)=>setFirstName(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='Prénom'/>
          <TextInput keyboardType='numeric' value={phoneNumber} onChangeText={(value)=>setPhoneNumber(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='Téléphone'/>
          <TextInput autoCapitalize='none' value={email} onChangeText={(value)=>setEmail(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='E-mail'/>
          <TextInput autoCapitalize='none' secureTextEntry={true} value={password} onChangeText={(value)=>setPassword(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='Mot de passe'/>
          <TextInput autoCapitalize='none' secureTextEntry={true} value={confirmPassword} onChangeText={(value)=>setConfirmPassword(value)} style={styles.input} placeholderTextColor={'#D7D7E5'} placeholder='Confirmation mot de passe'/>
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
      color: '#FF7337',
      fontSize: 36,
      fontWeight: 'bold',
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
      fontWeight: '400'
    }, 

    textContainer: {
      flexDirection: 'row',
      
    },

    text: {
      fontSize: 16,
      fontWeight: 'bold',
    },

    linkText: {
      color: '#FF7337',
      fontSize: 16,
      fontWeight: 'bold',
    }

    
  });