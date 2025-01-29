import React, { useState } from 'react';
import { Container, Button, Alert, } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import '../Css/PdfToDocx.css';
import DragDrop from './DragDrop';

const PdfToDocx = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [conversionResult, setConversionResult] = useState(null);
    const [error, setError] = useState(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Veuillez sélectionner un fichier PDF.');
            return;
        }

        setIsConverting(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5500/api/convertPdfToDocx', formData, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                setConversionResult(response.data);
                toast.success('Conversion réussie ! Cliquez ci-dessous pour télécharger le fichier Word.');
            } else {
                toast.error('Erreur lors de la conversion. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur lors de la conversion', error);
            setError('Une erreur est survenue lors de la conversion. Veuillez réessayer.');
            toast.error('Une erreur est survenue lors de la conversion. Veuillez réessayer.');
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownload = () => {
        if (conversionResult instanceof Blob) {
            const originalFileName = selectedFile.name.replace(/\.pdf$/, '.docx'); // Remplace l'extension PDF par DOCX
            const url = window.URL.createObjectURL(conversionResult);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalFileName); // Utilise le nom original
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Téléchargement effectué avec succès : ${originalFileName}`);
            setConversionResult(null);
        } else {
            toast.error('Échec du téléchargement: fichier non valide');
        }
    };

    return (
        <Container className="text-center mt-5">
            <ToastContainer position="top-right" autoClose={5000} />
            <CSSTransition in={true} appear={true} timeout={500} classNames="fade">
                <h1 className="mb-4 display-4 text-gradient">Convertisseur PDF vers Word</h1>
            </CSSTransition>
            <DragDrop selectedFile={selectedFile} setSelectedFile={setSelectedFile} />


            {error && (
                <CSSTransition in={!!error} timeout={300} classNames="fade" unmountOnExit>
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                </CSSTransition>
            )}

            <Button
                variant="primary"
                onClick={handleUpload}
                className="mt-4 btn-gradient"
                disabled={!selectedFile || isConverting}
            >
                {isConverting ? 'Conversion en cours...' : 'Convertir en Word'}
            </Button>

            {conversionResult && (
                <CSSTransition in={!!conversionResult} timeout={300} classNames="fade">
                    <div className="mt-4">
                        <Button variant="success" onClick={handleDownload} className="btn-gradient">
                            Télécharger le document Word
                        </Button>
                    </div>
                </CSSTransition>
            )}
        </Container>
    );
};

export default PdfToDocx;