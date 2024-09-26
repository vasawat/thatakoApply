import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './components/Home';
import Apply from './components/Apply';
import Admin from './components/admin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
