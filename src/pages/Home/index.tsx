import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { StyleSheet, View, Text, StatusBar, Image, ImageBackground } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import IBGEApi from '../../services/IBGEApi'

const logo = require('../../assets/logo.png')
const homeBackground = require('../../assets/home-background.png')

interface UF {
  id: number,
  sigla: string,
  nome: string
}

interface City {
  id: number,
  nome: string
}

const Home = () => {

  const navigation = useNavigation();

  const [ufs, setUFs] = useState<UF[]>([])
  const [selectedUf, setSelectedUF] = useState<string>('0')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('0')

  useEffect(() => {
    IBGEApi.get('estados?orderBy=nome').then(response => {
      setUFs(response.data)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return

    IBGEApi.get(`estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
      setCities(response.data)
    })
  }, [selectedUf])


  function handleNavigation(pageName: string, uf: string, city: string) {
    navigation.navigate(`${pageName}`, { uf_id: uf, city_id: city })
  }

  return (
    <>
      <ImageBackground
        source={homeBackground}
        style={styles.container}
      // imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</Text>

        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={(value) => setSelectedUF(value)}
            items={ufs.map(uf => (
              { label: `${uf.sigla} - ${uf.nome}`, value: uf.id }
            ))}
          />

          <RNPickerSelect
            onValueChange={(value) => setSelectedCity(value)}
            items={cities.map(city => (
              { label: `${city.nome}`, value: city.id }
            ))}
          />

          <RectButton style={styles.button} onPress={() => { handleNavigation("Points", selectedUf, selectedCity) }}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color='#fff' size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </>
  )
}

export default Home


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});