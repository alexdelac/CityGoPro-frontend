import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { useFonts } from 'expo-font'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function ProfilScreen() {
  const [infos, setInfos] = useState('')
  const [userInfos, setUserInfos] = useState('')
  const [etablissementFound, setEtablissementFound] = useState(null)
  const [modalVisible, setModalVisible]= useState(false)


  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
  });


  const user = useSelector((state) => state.usersPro.value)


  //a l'ouverture de la page vérifie si un proprietaire a renseigner un établissement si oui renvoi la data de cet établissement
  useEffect(() => {
    fetch('http://10.1.2.64:3000/etablissements', {
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

  if (!fontsLoaded) {
    return null
  }


  // affiche les infos établissement ou le bouton pour renseigner un nouvel etablissement si aucun enregistré
  let display
  if (etablissementFound) {
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
          <Text></Text>
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
          <Text>photos</Text>
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
      <TouchableOpacity style={styles.button}>
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
        <View style={styles.centeredView}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalView}>
            <Text style={styles.modalTitle}>Mon établissement</Text>
            <View>
              <TextInput style={styles.input} placeholder="Nom de l'établissement" />
              <TextInput style={styles.input} placeholder="Type de l'établissement" />
              <TextInput style={styles.tallInput} placeholder="Adresse de l'établissement" />
              <TextInput style={styles.input} placeholder="N° de SIRET" />
              <TextInput style={styles.input} placeholder="Téléphone" />
              <TextInput style={styles.tallInput} placeholder="Description" />
              <TouchableOpacity>
                <Text style={styles.modalText}>+ Ajouter des photos à la galerie</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalButton}>
              <Text>Enregistrer les informations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text onPress={()=>setModalVisible(!modalVisible)} style={styles.textButton} >Retour</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
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



});