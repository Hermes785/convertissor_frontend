import React, { useState } from "react";
import { Container, Navbar, Nav, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaCheckCircle, FaFileWord, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../Css/PdfToDocx.css';
import DragDrop from './DragDrop';
import getApiUrls from '../Backend/api';

const PdfToDocx = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [conversionResult, setConversionResult] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Veuillez sélectionner un fichier PDF.");
            return;
        }

        setIsConverting(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(getApiUrls().apiConvertToDocx, formData);
            if (response.status === 200) {
                toast.success("Conversion en cours...");
                checkConversionStatus(response.data);
            } else {
                toast.error("Erreur lors de l’upload.");
                setIsConverting(false);
            }
        } catch (err) {
            toast.error("Une erreur est survenue.");
            setIsConverting(false);
        }
    };

    const checkConversionStatus = async (requestId) => {
        try {
            const response = await axios.get(`${getApiUrls().apiSendUrl}/${requestId}`);
            if (response.status === 200) {
                setConversionResult(response.data);
                setIsConverting(false);
                toast.success("Conversion terminée !");
            } else {
                setTimeout(() => checkConversionStatus(requestId), 3000);
            }
        } catch (err) {
            setTimeout(() => checkConversionStatus(requestId), 3000);
        }
    };

    const handleDownload = () => {
        if (conversionResult) {
            window.open(conversionResult, "_blank");
            toast.success("Téléchargement lancé !");
        } else {
            toast.error("Conversion non terminée.");
        }
    };

    return (
        <>
            <Navbar className="navbar-custom shadow" expand="lg">
                <Container>
                    <Navbar.Brand className="brand-title" style={{ display: "flex", alignItems: "center" }}>
                        <img src="/lo.jpg" alt="logo" style={{ height: "40px", marginRight: "5px" }} />
                        <span>PDF Convertisseur</span>
                    </Navbar.Brand>

                    <Nav className="ml-auto">
                        <Nav.Link href="#">Accueil</Nav.Link>
                        <Nav.Link href="#features">Fonctionnalités</Nav.Link>
                        <Nav.Link href="#contact">Contact</Nav.Link>
                    </Nav>
                    {isLoggedIn ? (
                        <Button variant="danger" onClick={() => setIsLoggedIn(false)}>
                            <FaSignOutAlt /> Déconnexion
                        </Button>
                    ) : (
                        <>
                            <Button variant="success" onClick={() => setIsLoggedIn(true)}>
                                <FaSignInAlt /> Connexion
                            </Button>
                            <Button variant="info" onClick={() => setIsLoggedIn(false)}>
                                <FaSignInAlt /> Inscription
                            </Button>
                        </>
                    )}
                </Container>


            </Navbar>

            <Container className="text-center main-container">
                <ToastContainer position="top-right" autoClose={5000} />
                <motion.h1 className="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    Convertissez vos PDF<FaFilePdf /> en Word <FaFileWord /> en un clic !
                </motion.h1>
                <p className="description">Téléchargez votre fichier PDF et obtenez une conversion rapide et efficace.</p>

                <DragDrop selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

                <Button className="btn-main" onClick={handleUpload} disabled={!selectedFile || isConverting}>
                    {isConverting ? <Spinner as="span" animation="border" size="sm" /> : <FaFilePdf />} {isConverting ? " Conversion en cours..." : " Convertir en Word"} {isConverting ? <Spinner as="span" animation="border" size="sm" /> : <FaFileWord />}
                </Button>

                {isConverting && (
                    <motion.div className="loading-container" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <Spinner animation="border" role="status" variant="primary" />
                        <p>Veuillez patienter...</p>
                    </motion.div>
                )}

                {conversionResult && (
                    <motion.div className="download-container" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <Button className="btn-download" onClick={handleDownload}>
                            <FaDownload /> Télécharger le document Word
                        </Button>
                    </motion.div>
                )}
            </Container>

            <Container className="features-container text-center" id="features">
                <h2 className="features-title">Pourquoi nous choisir ?</h2>
                <Row>
                    <Col md={4} className="feature-card">
                        <FaCheckCircle size={40} className="feature-icon" />
                        <h5>Conversion rapide</h5>
                        <p>Transformation ultra-rapide et fidèle au document original.</p>
                    </Col>
                    <Col md={4} className="feature-card">
                        <FaFilePdf size={40} className="feature-icon" />
                        <h5>Format conservé</h5>
                        <p>Respect des images, textes et mises en page.</p>
                    </Col>
                    <Col md={4} className="feature-card">
                        <FaDownload size={40} className="feature-icon" />
                        <h5>Gratuit</h5>
                        <p>Profitez d’un service entièrement gratuit et illimité.</p>
                    </Col>
                </Row>
            </Container>

            <Container id="faq" className="text-center mt-5">
                <h2 className="text-gradient">FAQ</h2>
                <p><strong>Comment fonctionne la conversion ?</strong> Téléchargez votre fichier et nous nous occupons du reste.</p>
                <p><strong>Est-ce gratuit ?</strong> Oui, notre service est entièrement gratuit.</p>
            </Container>

            <Container id="more-info" className="text-center mt-5">
                <h2 className="text-gradient">Pourquoi choisir notre convertisseur ?</h2>
                <Row>
                    <Col md={6}>
                        <Card className="p-4 card-gradient">
                            <h4>Conversion fiable</h4>
                            <p>Nous assurons une conversion fiable et rapide. Aucune information n'est modifiée, et le formatage reste intact.</p>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="p-4 card-gradient">
                            <h4>Support 24/7</h4>
                            <p>En cas de questions, notre équipe d'assistance est disponible 24/7 pour vous aider avec tout problème ou préoccupation.</p>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="footer text-center">
                <p>&copy; 2025 PDF Convertisseur. Tous droits réservés.</p>
            </Container>
        </>
    );
};

export default PdfToDocx;
