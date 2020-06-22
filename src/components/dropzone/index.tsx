import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './styles.css'
import { FiUpload } from 'react-icons/fi'

interface Props {
    onFileUploaded: (file: File) => void
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [fileURL, setFileURL] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        setFileURL(URL.createObjectURL(acceptedFiles[0]))
        onFileUploaded(acceptedFiles[0])
    }, [onFileUploaded])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />

            {fileURL
                ?
                <img src={fileURL} />
                :
                (
                    <p>
                        <FiUpload />
                            Imagem do estabelecimento
                    </p>
                )
            }
        </div>
    )
}

export default Dropzone