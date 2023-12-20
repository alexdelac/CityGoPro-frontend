import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView, Image } from 'react-native';
import { useFonts } from 'expo-font'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AutocompleteDropdown, AutocompleteDropdownContextProvider  } from 'react-native-autocomplete-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { disconnect } from '../reducers/usersPro';



export default function ProfilScreen({navigation}) {
  const [infos, setInfos] = useState('')
  const [userInfos, setUserInfos] = useState('')
  const [etablissementFound, setEtablissementFound] = useState(null)
  const [modalVisible, setModalVisible]= useState(false)
  const [adresse, setAdresse]= useState(null)
  const [selection, setSelection]= useState(null)
  const [selectedType, setSelectedType]= useState(null)
  const [selectedAddresse, setSelectedAdresse]=useState(null)
  const [phone, setPhone]=useState(null)
  const [siret, setSiret]=useState(null)
  const [description, setDescription]=useState(null)
  const [name, setName]=useState(null)
  const [photoLoaded, setPhotoLoaded]=useState(false)

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });


  const user = useSelector((state) => state.usersPro.value)
  const dispatch = useDispatch()

  //a l'ouverture de la page vérifie si un proprietaire a renseigner un établissement si oui renvoi la data de cet établissement
  useEffect(() => {
    fetch('http://192.168.1.60:3000/etablissements', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user }),
    })
      .then(response => response.json())
      .then(data => {

        if (data.result) {
          setInfos(data.infos)
          setUserInfos(data.user)
          setEtablissementFound(true)
        } else {
          setEtablissementFound(false)
        }

      })
  }, [])

//a chaque modification de l'input adresse intérroge l'API data.gouv afin d'obtenir les 5 adresse les plus pertinantes avec leurs coordonnées gps
  useEffect(()=>{
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}&limit=5`)
        .then(response=>response.json())
        .then(data=>{
            setSelection(data.features.map((data, i)=>{
              return {id: i, title: data.properties.label, coord: data.geometry}
              
            }))
        })
  }, [adresse])

  if (!fontsLoaded) {
    return null
  }

  function handleSubmit(){
    if(!etablissementFound){
      fetch('http://192.168.1.60:3000/etablissements/create', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user, name:name, type:selectedType.title, siret:siret, telephone: phone, description: description, adresse: selectedAddresse.title, coord: selectedAddresse.coord }),
    })
      .then(response=>response.json())
      .then(data=>{
        if (data.result) {
          setInfos(data.infos)
          setUserInfos(data.user)
          setEtablissementFound(true)
          setModalVisible(!modalVisible)
        } else {
          setEtablissementFound(false)
        }
      })
    } else {
      fetch('http://192.168.1.60:3000/etablissements/update', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user, }),
    })
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
      })
    }
  }

  const handleImagePicker= async() =>{
    (async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus !== 'granted') {
        console.error('La permission d\'accès à la galerie n\'a pas été accordée');
      }
    })()
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      const formData = new FormData()

    formData.append('photoFromFront', {
      uri: selectedImage.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    })

    fetch(`http://192.168.1.60:3000/etablissements/upload/${user}`, {
      method: 'PUT',
      body: formData, 
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
    })
    }
  }

  const handleDisconnect = ()=>{
      dispatch(disconnect())
      navigation.navigate('Signin')
  }
  
console.log(selectedAddresse)

  // affiche les infos établissement ou le bouton pour renseigner un nouvel etablissement si aucun enregistré
  let display
  if (etablissementFound) {
    const photo = infos.photos.map((data, i)=>{
      return <Image key={i} source={{uri: `${data}`}} style={styles.photo}/>
    })
    display = (
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Nom de l'établissement :</Text>
          <Text>{infos.name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Type de l'établissement :</Text>
          <Text>{infos.type}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Adresse :</Text>
          <Text>{infos.adresse}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>N° de SIRET :</Text>
          <Text>{infos.siret}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Nom du gérant :</Text>
          <Text>{userInfos.lastName} {userInfos.firstName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Téléphone :</Text>
          <Text>{infos.telephone}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Description :</Text>
          <Text>{infos.description}</Text>
        </View>
        <View>
          <Text style={styles.itemTitle}>Galerie photos :</Text>
            <View style={styles.photoContainer}>
              {photo}
            </View>
          <TouchableOpacity onPress={()=>handleImagePicker()}>
                <Text style={styles.modalText}>+ Ajouter des photos à la galerie</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  } else {
    display = (
      <TouchableOpacity style={styles.button}>
        <Text style={styles.textButton} onPress={()=>setModalVisible(!modalVisible)}>Ajouter un établissement</Text>
      </TouchableOpacity>
    )
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Mon établissement</Text>
         {etablissementFound && <TouchableOpacity>
            <FontAwesome name='pencil' color={'#8440B4'} size={20}  onPress={()=>setModalVisible(!modalVisible)}/>
          </TouchableOpacity>}
        </View>
        {display}
      </View>
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.subTitle}>Informations de connexion</Text>
          <FontAwesome name='pencil' color={'#8440B4'} size={20} />
        </View>
        <View style={styles.textContainer}>
          <Text>E-mail : </Text>
          <Text>{userInfos.email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=>handleDisconnect()}>
        <Text style={styles.textButton}>Se déconnecter</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.deleteLink}>Supprimer le compte</Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
      >
        <AutocompleteDropdownContextProvider>
        <View style={styles.centeredView}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalView}>
            <Text style={styles.modalTitle}>Mon établissement</Text>
            <View>
              <TextInput onChangeText={(value)=>setName(value)} style={styles.input} placeholder={etablissementFound ? infos.name :"Nom de l'établissement"} placeholderTextColor={'#D7D7E5'} />
              <AutocompleteDropdown
                  clearOnFocus={false}
                  closeOnBlur={true}
                  closeOnSubmit={false}
                  onSelectItem={setSelectedType}
                  dataSet={[
                    { id: '1', title: 'Bar' },
                    { id: '2', title: 'Restaurant' },
                    { id: '3', title: 'Bar/restaurant' },
                  ]}
                  textInputProps={{
                    placeholder: "Type de l'établissement",
                    style: {
                      fontSize: 15,
                      alignSelf: 'center',
                      paddingLeft: 9,
                   }
                   }}
                   inputContainerStyle={{
                    width: 285,
                      height: 50,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#D7D7E5',
                      backgroundColor: 'white',
                      marginTop: 9,
                   }                 
                   }
                />
              <AutocompleteDropdown     
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    onSelectItem={(item)=>setSelectedAdresse(item)}
                    onChangeText={(value)=> setAdresse(value.replace(/ /g, '+'))}
                    textInputProps={{
                     placeholder: "Adresse de l'établissement",
                     style: {
                        fontSize: 15,
                        alignSelf: 'center',
                        paddingLeft: 9,
                     }
                    }}
                    dataSet={selection}
                    inputContainerStyle={{
                      width: 285,
                        height: 50,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#D7D7E5',
                        backgroundColor: 'white',
                        marginTop: 9,
                     }} 
               />
              <TextInput onChangeText={(value)=>setSiret(value)}  style={styles.input} placeholder="N° de SIRET" placeholderTextColor={'#D7D7E5'}/>
              <TextInput inputMode='tel' onChangeText={(value)=>setPhone(value)} style={styles.input} placeholder="Téléphone" placeholderTextColor={'#D7D7E5'}/>
              <TextInput onChangeText={(value)=>setDescription(value)}  style={styles.tallInput} placeholder="Description" placeholderTextColor={'#D7D7E5'}/>
             
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={()=>handleSubmit()}>
              <Text>Enregistrer les informations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text onPress={()=>setModalVisible(!modalVisible)} style={styles.textButton} >Retour</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
        </AutocompleteDropdownContextProvider>
      </Modal>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  title: {
    color: '#1E98EF',
    fontSize: 36,
    fontFamily: 'Quicksand-Bold',
    marginTop: 25
  },

  subTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#8440B4',
    marginRight: 10
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  itemTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#341C42'
  },

  

  button: {
    width: 285,
    height: 50,
    borderWidth: 1,
    borderColor: '#8440B4',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  textButton: {
    color: '#8440B4',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold'
  },

  deleteLink: {
    color: '#1E98EF',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold'
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 285,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginTop: 9,
    paddingLeft: 9,
  },

  tallInput: {
    width: 285,
    height: 90,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginTop: 9,
    paddingLeft: 9,
  },

  modalTitle: {
    fontSize: 24,
    color: '#1E98EF',
    fontFamily: 'Quicksand-Bold'
  },

  modalButton: {
    width: 285,
    height: 50,
    backgroundColor: '#8440B4',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalText: {
    color: '#1E98EF',
    fontFamily: 'Quicksand-SemiBold',
    margin: 5,
    marginBottom: 20,
  },

  photoContainer: {
    flexDirection: 'row',
  },

  photo: {
    width: 50,
    height: 50,
    margin: 5,
  },



});