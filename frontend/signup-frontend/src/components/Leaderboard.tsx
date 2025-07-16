import React, { useEffect, useState } from 'react';
import axios from 'axios';
interface Result {
    userId: string,
    name: string,
    score: string,
    totalQuestions: number
}

const API_BASE_URL = 'http://localhost:3000';

const Leaderboard: React.FC = () => {
    const {quizId} = useParams<{quizId:string}>();
    const {token, isAuthenticated} = useAuth();
    const [results, setResults] = useState<LeaderboardEntry[]>([]);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(()=>{
        const fetchLeaderboard = async () => {
            if(!isAuthenticated){
                setLoading(false);
                setError("Please sign in to view the leaderboard");
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/result/${quizId}`,{
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setResults(response.data.results);
            } catch(err: any){
                setError(err.response?.data?.message || 'Failed to fetch leaderboard');
            } finally{
                setLoading(false);
            }
        };
        fetchLeaderboard();
    },[quizId, isAuthenticated, token]);
    if(loading){
        return <div>Loading leaderboard...</div>
    }
    if(error){
        return <div style={{color: 'red'}}>{error}</div>;
    }
    return (
        <div>
            <h2>Leaderboard for Quiz: {quizId}</h2>
            {results.length === 0 ? (
                <p>No results yet for this quiz.</p>
            ): (
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Total Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.sort((a,b)=> b.score - a.score)}
                    </tbody>
                </table>
            )}
        </div>
    )
}

