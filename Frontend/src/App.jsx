import React from 'react';    
import AdminDashboard from './pages/admin/adminDashboard';
import Login from './pages/admin/login';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import Register from './pages/admin/register';  
 

function App() {

// const [message, setMessage] = useState(""); // ✅ define it     


//  const fetchData = async () => {
//    try {
//      const response = await axios.get("http://localhost:5000/tasks");
//      setMessage(response.data.message);
//    } catch (error) {
//      console.error("Error fetching data:", error);
//    }
//  };

//  useEffect(() => {
//    fetchData();
//  }, []);    

 return (
  <BrowserRouter>
    <Routes>
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/userDashboard" element={<UserDashboard />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
    </Routes>
  </BrowserRouter>
 );

}

export default App;