import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import ComicsList from "../comicsList/ComicsList"
import MainPage from "../pages/mainPage"


const App = () => {

    const [selectedChar, setSelectedChar] = useState(null);

    const onCharSelected = (id) => {
        setSelectedChar(id);
    }

    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/comics" element={<ComicsList onComicsSelected={onCharSelected} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;