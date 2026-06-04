// ============================================
// SERVEUR PRINCIPAL - EPS MAROC CONNECT
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('./config/database');

const app = express();
const PORT = 3001;

// Sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());

// ============================================
// ROUTE : Vérifier que le serveur marche
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'EPS Maroc Connect fonctionne !' });
});

// ============================================
// ROUTE : Inscription (créer un compte)
// ============================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, school } = req.body;
        
        // Vérifier si l'email existe déjà
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Cet email existe déjà' });
        }

        // Cacher le mot de passe (cryptage)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const result = await query(
            'INSERT INTO users (email, password_hash, role, first_name, last_name, school) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, first_name, last_name',
            [email, hashedPassword, role, firstName, lastName, school]
        );

        const user = result.rows[0];

        // Créer un token (clé d'accès)
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'mon_secret_temporaire',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Compte créé avec succès !',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ============================================
// ROUTE : Connexion
// ============================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chercher l'utilisateur
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer un token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'mon_secret_temporaire',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ============================================
// ROUTE : Liste des APS (sports)
// ============================================
app.get('/api/aps', async (req, res) => {
    try {
        const result = await query('SELECT * FROM aps ORDER BY category, name');
        res.json({ data: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ============================================
// Démarrer le serveur
// ============================================
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   EPS MAROC CONNECT - API           ║');
    console.log('║   Port: ' + PORT + '                      ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');
    console.log('Testez : http://localhost:' + PORT + '/health');
})