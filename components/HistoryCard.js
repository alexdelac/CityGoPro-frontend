import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';



export default function HistoryCard(props) {
    return (

        <View style={styles.eventCard}>
            <View>
                <View style={styles.textLogoContainer}>
                    <View style={styles.eventInfos}>
                        <Text style={styles.title}>Titre:</Text>
                        <Text style={styles.eventInfos}>{props.title}</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name='rotate-right' color={'#8440B4'} size={20} style={styles.buttonCard} />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.eventInfos}>
                <Text style={styles.title}>Date:</Text>
                <Text style={styles.eventInfos}>du {format(new Date(props.startTime), 'dd/MM/yy HH:mm')} au {format(new Date(props.endTime), 'dd/MM/yy HH:mm')}</Text>
            </View>
            <View style={styles.eventInfos}>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.eventInfos} numberOfLines={3} ellipsizeMode="tail">{props.description}</Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({

    eventCard: {
        height: 160,
        width: 356,
        borderWidth: 1,
        borderColor: '#D7D7E5',
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20,
    },
    textLogoContainer :{
        flexDirection : 'row',
        justifyContent : 'space-between'
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
        // width: 220,
    },
    buttonCard: {
        color: '#1E98EF',
    },
});