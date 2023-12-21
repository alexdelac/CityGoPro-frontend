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
  const [adresse, setAdresse]= useState('')
  const [selection, setSelection]= useState(null)
  const [selectedType, setSelectedType]= useState(null)
  const [selectedAddresse, setSelectedAdresse]=useState(null)
  const [phone, setPhone]=useState(null)
  const [siret, setSiret]=useState(null)
  const [description, setDescription]=useState(null)
  const [name, setName]=useState(null)
  const [update, setUpdate]=useState(false)
  const [photoLoaded, setPhotoLoaded]=useState(false)

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf')
  });


  const user = useSelector((state) => state.usersPro.value)
  const dispatch = useDispatch()

  //a l'ouverture de la page vérifie si un proprietaire a renseigner un établissement si oui renvoi la data de cet établissement
  useEffect(() => {
    fetch('http://10.1.1.249:3000/etablissements', {
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
          //set les états des infos établissements pour réutilisation si update
          setName(data.infos.name)
          setSiret(data.infos.siret)
          setPhone(data.infos.telephone)
          setDescription(data.infos.description)
        } else {
          setEtablissementFound(false)
        }

      })
  }, [update])

//a chaque modification de l'input adresse intérroge l'API data.gouv afin d'obtenir les 5 adresse les plus pertinantes avec leurs coordonnées gps
  useEffect(()=>{
    //ne déclenche la requete qu'a partir de 3 caractéres car minimum demandé par l'API
    if(adresse.length>3){
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse}&limit=5`)
        .then(response=>response.json())
        .then(data=>{
          if(data){

            setSelection(data.features.map((data, i)=>{
              return {id: i, title: data.properties.label, coord: data.geometry}
              
            }))
          }
         
        })
    }   
  }, [adresse])

  if (!fontsLoaded) {
    return null
  }

  function handleSubmit(){
    if(!etablissementFound){
      fetch('http://10.1.1.249:3000/etablissements/create', {
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
      fetch('http://10.1.2.64:3000/etablissements/update', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user, name:name, siret:siret, telephone: phone, description: description}),
    })
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
        setModalVisible(!modalVisible)
        setUpdate(!update)
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

    fetch(`http://10.1.2.64:3000/etablissements/upload/${user}`, {
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
          <Text style={styles.response}>{infos.name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Type de l'établissement :</Text>
          <Text style={styles.response}>{infos.type}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Adresse :</Text>
          <Text style={styles.response}>{infos.adresse}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>N° de SIRET :</Text>
          <Text style={styles.response}>{infos.siret}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Nom du gérant :</Text>
          <Text style={styles.response}>{userInfos.lastName} {userInfos.firstName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Téléphone :</Text>
          <Text style={styles.response}>{infos.telephone}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Description :</Text>
          <Text style={styles.response}>{infos.description}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Galerie photos :</Text>
        </View>
        <View style={styles.textContainer}>
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
          <Text style={styles.itemTitle}>E-mail : </Text>
          <Text style={styles.response}>{userInfos.email}</Text>
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
              <TextInput onChangeText={(value)=>setName(value)} style={styles.input} placeholder={etablissementFound ? `Nom : ${infos.name}` :"Nom de l'établissement"} placeholderTextColor={'#D7D7E5'} />
              {!etablissementFound && <AutocompleteDropdown
                  clearOnFocus={false}
                  closeOnBlur={true}
                  closeOnSubmit={false}
                  onSelectItem={setSelectedType}
                  dataSet={[
                    { id: '1', title: 'Bar' },
                    { id: '2', title: 'Restaurant' },
                    { id: '3', title: 'Bar / Restaurant' },
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
                />}
              {!etablissementFound && <AutocompleteDropdown     
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    debounce={400}
                    initialValue={selectedAddresse}
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
               />}
              <TextInput onChangeText={(value)=>setSiret(value)}  style={styles.input} placeholder={etablissementFound ? `Siret : ${infos.siret}` :"N° de SIRET"} placeholderTextColor={'#D7D7E5'}/>
              <TextInput inputMode='tel' onChangeText={(value)=>setPhone(value)} style={styles.input} placeholder={etablissementFound ? `Telephone :${infos.telephone}` :"Téléphone"} placeholderTextColor={'#D7D7E5'}/>
              <TextInput onChangeText={(value)=>setDescription(value)}  style={styles.tallInput} placeholder={etablissementFound ? `Description : ${infos.description}` :"Description"} placeholderTextColor={'#D7D7E5'}/>
             
            </View>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={()=>handleSubmit()}
            >
              <Text style={styles.modalButtonText}>Enregistrer les informations</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button}
              onPress={()=>setModalVisible(!modalVisible)} 
            >
              <Text style={styles.textButton} >Retour</Text>
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
    justifyContent: 'space-between',
  },

  title: {
    color: '#1E98EF',
    fontSize: 36,
    fontFamily: 'Quicksand-Bold',
    marginTop: 90,
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
    marginHorizontal: 15,
    marginTop: 5,
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
    alignItems: 'center',
    marginBottom: 20,
  },

  textButton: {
    color: '#8440B4',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold'
  },

  deleteLink: {
    color: '#1E98EF',
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 15,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
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
    marginTop: 5,
    paddingLeft: 9,
  },

  tallInput: {
    width: 285,
    height: 90,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D7D7E5',
    marginTop: 5,
    paddingLeft: 9,
  },

  modalTitle: {
    fontSize: 24,
    color: '#1E98EF',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 15,
  },

  modalButton: {
    width: 285,
    height: 50,
    backgroundColor: '#8440B4',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Quicksand-SemiBold',
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
    width: 55,
    height: 55,
    margin: 5,
    borderWidth: 3,
    borderColor: '#1E98EF'
  },
  response: {
    color: '#341C42',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    marginLeft: 10,
  },



});