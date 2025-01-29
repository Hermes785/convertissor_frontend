import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PdfToDocx from "./Components/PdfToDocx";

const AppRouter = () => {


    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<PdfToDocx />} />
            </Routes>

        </BrowserRouter>
    )
}
export default AppRouter