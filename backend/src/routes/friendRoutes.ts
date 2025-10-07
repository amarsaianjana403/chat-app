import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();


function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Send friend request
router.post('/send/:receiverId', verifyToken, async (req, res) => {
  try {
    const requesterId = (req as any).user.userId;
    const receiverId = parseInt(req.params.receiverId);

    if (requesterId === receiverId) {
      return res.status(400).json({ error: 'You cannot send a request to yourself' });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    const newRequest = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: 'pending'
      }
    });

    res.json({ message: 'Friend request sent', newRequest });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend request', details: error });
  }
});

router.post('/undo/:receiverId', verifyToken, async (req, res)=> {
    try {
        const requesterId = (req as any).user.userId;
        const receiverId = parseInt(req.params.receiverId)

        const existing = await prisma.friendship.findFirst({
            where: {
                requesterId,
                receiverId,
                status: 'pending'
            }
        });
        if(!existing){
            return res.status(404).json({ error: 'No pending friend request found to undo' });
        }   
        await prisma.friendship.delete({ where: { id: existing.id } });
        res.json({ message: 'Friend request undone' });
    } catch (error) {
        res.status(500).json({ error: 'Error undoing friend request', details: error });    
    }
});

router.post('/unfriend/:friendId', verifyToken, async (req, res)=> {
    try {
        const userId = (req as any).user.userId;
        const friendId = parseInt(req.params.friendId)
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: userId, receiverId: friendId, status: 'accepted' },
                    { requesterId: friendId, receiverId: userId, status: 'accepted' }
                ]
            }
        });
        if (!existing) {
            return res.status(404).json({ error: 'Friendship not found' });
        }
        await prisma.friendship.delete({ where: { id: existing.id } });
        res.json({ message: 'Unfriended successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error unfriending user', details: error });
    }
});

router.post('/accept/:requestId', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const requestId = parseInt(req.params.requestId);

    const existing = await prisma.friendship.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: 'pending'
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'accepted' }
    });

    res.json({ message: 'Friend request accepted', updated });
  } catch (error) {
    res.status(500).json({ error: 'Error accepting friend request', details: error });
  }
});
router.post('/reject/:requestId', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const requestId = parseInt(req.params.requestId);
    const existing = await prisma.friendship.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: 'pending'
      }
    });
    if (!existing) {
        return res.status(404).json({ error: 'Friend request not found' }); 
    }
    await prisma.friendship.delete({ where: { id: requestId } });
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting friend request', details: error });
  }
});

router.get('/pending', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const pendingRequests = await prisma.friendship.findMany({  
      where: {
        receiverId: userId,
        status: 'pending'
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending friend requests', details: error });
  }
});

router.get('/friends', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
            { requesterId: userId, status: 'accepted' },
            { receiverId: userId, status: 'accepted' }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    // Extract the friend user data (not the current user)
    const friends = friendships.map(friendship => {
      if (friendship.requesterId === userId) {
        return friendship.receiver;
      } else {
        return friendship.requester;
      }
    });

    res.json(friends);
  }
    catch (error) {
    res.status(500).json({ error: 'Error fetching friends list', details: error });
  }
});

router.get('/sent', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const sentRequests = await prisma.friendship.findMany({  
      where: {
        requesterId: userId,
        status: 'pending'
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    res.json(sentRequests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sent friend requests', details: error });
  }
});

export default router;