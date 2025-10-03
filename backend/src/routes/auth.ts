import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

const blacklistedTokens: string[] = [];

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// Placeholder login route
// ...existing code...

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                username: user.username 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful', 
            token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    blacklistedTokens.push(token);
  }
  res.json({ message: 'Logged out successfully' });
});


// Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId; // set from JWT payload
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true } // exclude password
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// middleware
// ...existing code...

// Fixed middleware
function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // check blacklist
  if (blacklistedTokens.includes(token)) {
    return res.status(403).json({ error: 'Token is invalid (logged out)' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err: any, user: any) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.user = user;
    next();
  });
}




export default router;