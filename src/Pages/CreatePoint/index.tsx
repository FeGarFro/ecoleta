import logo from '../../assets/logo.svg'
import './styles.css'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import { IBGEApi } from '../../services/ibge'
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/dropzone'


interface Item {
    id: number,
    title: string,
    image_url: string
}

interface UF {
    id: number,
    sigla: string,
    nome: string
}

interface City {
    id: number,
    nome: string
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUFs] = useState<UF[]>([])
    const [selectedUf, setSelectedUF] = useState<string>('0')
    const [cities, setCities] = useState<City[]>([])
    const [selectedCity, setSelectedCity] = useState<string>('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedImage, setSelectedImage] = useState<File>()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>) {
        setSelectedUF(e.target.value)
    }

    function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(e.target.value)
    }

    function onMapClick(e: LeafletMouseEvent) {
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ])
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleSelectedItem(id: number) {

        selectedItems.includes(id) ? setSelectedItems(selectedItems.filter(item => item !== id)) : setSelectedItems([...selectedItems, id])

    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const { name, email, whatsapp } = formData
        const state = selectedUf
        const city = selectedCity
        const [lat, long] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('lat', String(lat))
        data.append('long', String(long))
        data.append('city', city)
        data.append('state', state)
        data.append('items', items.join(','))

        if (selectedImage) {
            data.append('image', selectedImage)
        }


        await api.post('points', data)

        alert('Ponto Criado')
    }



    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setSelectedPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        IBGEApi.get('?orderBy=nome').then(response => {
            setUFs(response.data)
        })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') return
        IBGEApi.get(`/${selectedUf}/municipios?orderBy=nome`).then(response => {
            setCities(response.data)
        })
    }, [selectedUf])


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedImage} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={selectedPosition} zoom={15} onClick={onMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />

                    </Map>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.id} value={uf.id}>{uf.sigla} - {uf.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <select
                                name="cidade"
                                id="cidade"
                                value={selectedCity}
                                onChange={handleSelectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.nome}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => { handleSelectedItem(item.id) }}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit" >Cadastrar Ponto de Coleta</button>

            </form>
        </div>
    );
}

export default CreatePoint