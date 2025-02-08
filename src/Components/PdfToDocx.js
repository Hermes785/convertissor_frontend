import React, { useState } from 'react';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import '../Css/PdfToDocx.css';
import DragDrop from './DragDrop';
import Api from '../../api/api';

const PdfToDocx = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [conversionResult, setConversionResult] = useState(null);
    const [error, setError] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fonction pour gérer l'upload du fichier
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Veuillez sélectionner un fichier PDF.');
            return;
        }

        setError(null);
        setIsConverting(true);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(Api().apiConvertToDocx, formData);

            if (response.status === 200) {
                toast.success('Fichier téléchargé avec succès. Conversion en cours...');
                checkConversionStatus(response.data);
            } else {
                toast.error('Erreur lors de l\'upload. Veuillez réessayer.');
                setIsConverting(false);
                setLoading(false);
            }
        } catch (err) {
            console.error('Erreur lors de l\'upload', err);
            toast.error('Une erreur est survenue lors du téléchargement.');
            setIsConverting(false);
            setLoading(false);
        }
    };

    // Fonction pour vérifier le statut de la conversion
    const checkConversionStatus = async (requestId) => {
        try {
            console.log("Vérification de la conversion pour ID:", requestId);
            const response = await axios.get(`${Api().apiSendUrl}/${requestId}`);

            if (response.status === 200) {
                setConversionResult(response.data);
                setLoading(false);
                setIsConverting(false);
                toast.success('Conversion terminée !');
            } else {
                setTimeout(() => checkConversionStatus(requestId), 3000);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération du fichier', err);
            if (err.response?.data?.message === "Le fichier n'est pas disponible") {
                setTimeout(() => checkConversionStatus(requestId), 3000);
            } else {
                toast.error('Erreur lors de la récupération du fichier.');
                setIsConverting(false);
                setLoading(false);
            }
        }
    };

    // Fonction de téléchargement du fichier converti
    const handleDownload = () => {
        if (conversionResult) {
            window.open(conversionResult, "_blank")
            toast.success('Téléchargement lancé avec succès !');
        } else {
            toast.error('Échec du téléchargement: lien non valide ou conversion non terminée.');
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

            {/* Affichage du Loader pendant la conversion */}
            {loading && (
                <div className="mt-4">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="sr-only">Conversion en cours...</span>
                    </Spinner>
                    <p>La conversion est en cours, veuillez patienter...</p>
                </div>
            )}

            {/* Affichage du bouton de téléchargement uniquement si la conversion est terminée */}
            {conversionResult && (
                <CSSTransition in={!!conversionResult} timeout={300} classNames="fade">
                    <div className="mt-4">
                        <Button
                            variant="success"
                            onClick={handleDownload}
                            className="btn-gradient"
                            disabled={loading}
                        >
                            Télécharger le document Word
                        </Button>
                    </div>
                </CSSTransition>
            )}
        </Container>
    );
};

export default PdfToDocx;
