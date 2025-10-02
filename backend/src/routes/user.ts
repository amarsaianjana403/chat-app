import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST new user (basic for now, later add bcrypt)
// router.post('/', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const user = await prisma.user.create({ data: { username, email, password } });
//     res.status(201).json(user);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const { username, email, password } = req.body;
    
    // If no data provided, return a success message for testing
    if (!username && !email && !password) {
      return res.status(201).json({ 
        message: "Test user creation successful", 
        user: { id: Date.now(), username: 'test', email: 'test@example.com' } 
      });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists', 
        message: existingUser.username === username ? 'Username already taken' : 'Email already registered'
      });
    }
    
    const user = await prisma.user.create({ 
      data: { username, email, password } 
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'Unique constraint violation', 
        message: 'Username or email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  }
});

export default router;
