import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSelector} from 'react-redux'
import { useState, useEffect } from 'react';
import HistoryCard from '../components/HistoryCard';




const BACKEND_ADDRESS = 'http://10.1.2.64:3000';


export default function HistoricalScreen() {

const user = useSelector((state) => state.usersPro.value)

const [eventPass, setEventPass] = useState([])

  useEffect(()=>{
    fetch(`${BACKEND_ADDRESS}/events/historical`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user}),
     }) 
      .then(response => response.json())
      .then(data => {
       console.log(data)
        if (data.result){
          setEventPass(data.events)
        }

      })
  },[])
    

const pastEvents = eventPass.map((e, i)=>{
return <HistoryCard key={i} {...e}/>
})


  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Historique</Text>
      <ScrollView>
      {pastEvents}
      </ScrollView>
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
});