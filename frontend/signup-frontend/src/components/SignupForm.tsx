import { useState } from "react";
import axios from 'axios'

interface FormData {
  name: string,
  email: string,
  password: string,
  role: string,
}
const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name:'',
    email:'',
    password:'',
    role:'USER',    
  });
const [message, setMessage] = useState('');
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
setFormData({
  ...formData,
  [e.target.name]: e.target.value,
  });  
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try{
    const res = await axios.post("http://localhost:3000/signup", formData);
    setMessage(res.data.message);
  }
  catch(err){
    console.log(err);
    setMessage('Signup failed');
  }
}
return (
    <div style={{padding:'1rem'}}>
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /> <br/> <br/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /> <br/> <br/>
        <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /> <br/> <br/>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value='USER'>USER</option>
          <option value="ADMIN">ADMIN</option>
        </select> <br/><br/>
        </form>
        {message && <p>{message}</p>}
    </div>
)};
export default SignupForm

