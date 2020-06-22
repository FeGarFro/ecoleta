import React, { useEffect, useState } from 'react'
import { Feather as Icon, FontAwesome as FA } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { StyleSheet, View, Text, StatusBar, Image, ImageBackground, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker, Point } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { RectButton } from 'react-native-gesture-handler'
import ApiRequest from '../../services/apiRequest'
import * as MailComposer from 'expo-mail-composer';
import IBGEApi from '../../services/IBGEApi'


const homeBackground = require('../../assets/home-background.png')


interface Params {
  point_id: number,
  uf_id: string,
  city_id: string
}

interface PointData {
  point: {
    name: string,
    image: string,
    image_url: string,
    email: string,
    whatsapp: string,
    lat: number,
    long: number,
    city: string,
    state: string,
  },
  items: {
    item_id: number,
    image: string,
    title: string
  }[]
}

interface City {
  nome: string
}

interface Uf {
  sigla: string
}

const Points = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params

  const [pointData, setPointData] = useState<PointData>({} as PointData)
  const [cityName, setCityName] = useState<City>()
  const [ufName, setUfName] = useState<Uf>()

  useEffect(() => {
    ApiRequest.get(`points/${routeParams.point_id}`).then(response => {
      setPointData(response.data)

    })
  }, [])

  useEffect(() => {
    IBGEApi.get(`municipios/${routeParams.city_id}`).then(response => {
      setCityName(response.data)
    })
    IBGEApi.get(`estados/${routeParams.uf_id}`).then(response => {
      setUfName(response.data)
    })
  }, [setPointData])

  function handleNavigation(pageName: string) {
    navigation.navigate(`${pageName}`)
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=+55${pointData.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos.`)
  }

  function handleEmail() {
    MailComposer.composeAsync({
      subject: "Interesse na Coleta de resíduos",
      recipients: [pointData.point.email],
    })
  }

  if (!pointData.point) {
    return null
  }

  return (
    <>
      <ImageBackground
        source={homeBackground}
        style={styles.container}
      // imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>

          <TouchableOpacity onPress={navigation.goBack}>
            <Icon name="arrow-left" color="#34cb79" size={24}></Icon>
          </TouchableOpacity>

          <Image style={styles.pointImage} source={{ uri: pointData.point.image_url }} />
          <Text style={styles.pointName}>{pointData.point.name}</Text>
          <View style={styles.itemsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pointData.items.map(item => (
                <TouchableOpacity
                  key={String(item.item_id)}
                  style={styles.item}
                  onPress={() => { }}>
                  <SvgUri width={42} height={42} uri={`http://192.168.0.14:3333/images/${item.image}`} />
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>{cityName?.nome}, {ufName?.sigla}</Text>
          </View>

        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsapp}>
            <FA name="whatsapp" color="#fff" size={24} />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleEmail}>
            <Icon name="mail" color="#fff" size={24} />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>

      </ImageBackground>
    </>
  )
}

export default Points

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  main: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 32 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 16,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium'
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});