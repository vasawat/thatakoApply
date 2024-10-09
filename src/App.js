import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StudentProvider } from './contexts/StudentContext';
import Home from './components/Home';
import Apply from './components/Apply';
import Admin from './components/admin';
import StudentDetail from './components/StudentDetail';

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <StudentProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/student/:id" element={<StudentDetail />} />
            </Routes>
          </StudentProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </div>
  );
}

export default App;
