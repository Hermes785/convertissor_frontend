import React, { useState } from 'react';
import { Form, FormGroup, FormControl, Card } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";

const DragDrop = ({ selectedFile, setSelectedFile }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            toast.error('Veuillez déposer un fichier PDF valide.');
        }
    };

    return (
        <>
            <ToastContainer />
            <Card
                className={`shadow-sm drag-drop-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <Card.Body className="p-5">
                    <Form>
                        <FormGroup>
                            <FormControl
                                type="file"
                                id="fileUpload"
                                label="Choisir un fichier PDF"
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="mb-3"
                            />
                        </FormGroup>
                        <p className="text-muted">ou</p>
                        <p className="text-muted">Glissez-déposez un fichier PDF ici</p>
                    </Form>
                    {selectedFile && (
                        <p className="mt-2 text-success">Fichier sélectionné : {selectedFile.name}</p>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default DragDrop;
