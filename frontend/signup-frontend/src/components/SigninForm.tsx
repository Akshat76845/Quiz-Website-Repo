import React,{useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {useNavigate} from 'react-router-dom';
const Signin: React.FC = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {signin} = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        setError(null);
        try {
            await signin(email, password);
            navigate('/profile');
        } catch(err: any){
            setError(err.response?.data?.message || 'Signin failed');
        }
    };
    return (
        <div>
            <h2>Signin</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />    
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required/>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Signin</button>
            </form>
        </div>
    )
}