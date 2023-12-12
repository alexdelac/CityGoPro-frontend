import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { addToken } from '../reducers/usersPro'
import {useFonts} from 'expo-font'

export default function SigninScreen({navigation}) {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [error, setError] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });

  /*if(!fontsLoaded){
    return null
  }*/

  const dispatch = useDispatch()

  function handleSubmit(){

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (pattern.test(email)){
      if(email != null && password != null ){
        fetch('http://10.1.1.30:3000/usersPro/signin', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
          .then(response=>response.json())
          .then(data=>{
            console.log(data)
            if (data.result){
              dispatch(addToken(data.token))
              navigation.navigate('TabNavigator', {screen: 'Evenements'})
            } else {
              setError(data.error)
              
            }
            
          })
      } else {
        setError('Missing or empty fields')
      }
    } else {
      setError('Invalid Email')
      setEmail('')
    }
    
    Keyboard.dismiss()
  }




    return (
      <KeyboardAvoidingView style={styles.container} >
      <Text style={styles.title}>Connexion</Text>
      <View>
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
        <TouchableOpacity>
          <Text style={styles.forgetPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
      {error && <Text>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={()=>handleSubmit()}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Pas de compte ?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
            <Text style={styles.linkText}> Inscris-toi</Text>
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
      borderColor: '#FF7337',
    },

    inputLabel: {
      position: 'relative',
      color: '#FF7337',
      textAlign: 'center',
      width: 70,
      marginBottom: -14,
      marginLeft: 20,
      backgroundColor: 'white',
      zIndex: 1,
    },

    forgetPassword: {
      color: '#FF7337',
      fontSize: 16,
      fontFamily: 'Quicksand-Bold',
      paddingLeft: 5,
      marginTop: 10,
    },

    button: {
      width: 285,
      height: 50,
      backgroundColor: '#8440B4',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },

    reseauxText: {
      fontSize: 24,
      textAlign: 'center'
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
      fontFamily: 'Quicksand-Bold'
    },

    linkText: {
      color: '#FF7337',
      fontSize: 16,
      fontFamily: 'Quicksand-Bold'
    }
  });