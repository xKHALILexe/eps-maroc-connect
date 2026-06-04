// ============================================
// PAGE DE CONNEXION
// ============================================

import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // C'est quoi "useState" ? C'est comme une boîte qui garde une valeur
    // quand on tape dans un champ, la valeur change dans la boîte

    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        
        try {
            // On envoie email et mot de passe au serveur
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password
            });

            // Si ça marche, on sauvegarde le token
            localStorage.setItem('token', response.data.token);
            setMessage('✅ Connexion réussie !');
            
            // On pourrait rediriger vers le tableau de bord ici

        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Erreur de connexion'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-eps-green mb-6">
                    EPS Maroc Connect
                </h1>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eps-green focus:border-transparent"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eps-green focus:border-transparent"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-eps-green text-white rounded-lg font-bold hover:bg-green-800 transition-colors"
                    >
                        Se connecter
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                <p className="mt-4 text-center text-sm text-gray-500">
                    Pas encore de compte ? <a href="/register" className="text-eps-green font-medium">S'inscrire</a>
                </p>
            </div>
        </div>
    );
}

export default Login;