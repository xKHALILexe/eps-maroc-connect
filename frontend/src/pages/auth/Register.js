import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'teacher',
        school: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            setMessage('✅ Compte créé avec succès !');
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-eps-green mb-6">
                    Inscription
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                            <option value="teacher">Professeur</option>
                            <option value="student">Élève</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">École</label>
                        <input name="school" value={formData.school} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Nom de votre établissement" />
                    </div>

                    <button type="submit" className="w-full py-3 bg-eps-green text-white rounded-lg font-bold hover:bg-green-800">
                        Créer mon compte
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Register;