import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId: req.userId } },
      },
      include: {
        members: { select: { userId: true, role: true } },
        _count: { select: { members: true } },
      },
    });
    res.json(groups);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, color } = req.body;
    if (!name || !color) {
      res.status(400).json({ message: '그룹 이름과 색상은 필수입니다.' });
      return;
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        color,
        members: {
          create: { userId: req.userId!, role: 'owner' },
        },
      },
      include: { members: true },
    });
    res.status(201).json(group);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId: id } },
    });
    if (!member) {
      res.status(403).json({ message: '접근 권한이 없습니다.' });
      return;
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
      },
    });
    if (!group) {
      res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
      return;
    }
    res.json(group);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const joinGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      res.status(400).json({ message: '초대 코드를 입력해주세요.' });
      return;
    }

    const group = await prisma.group.findUnique({ where: { inviteCode } });
    if (!group) {
      res.status(404).json({ message: '유효하지 않은 초대 코드입니다.' });
      return;
    }

    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId: group.id } },
    });
    if (existing) {
      res.status(409).json({ message: '이미 가입된 그룹입니다.' });
      return;
    }

    await prisma.groupMember.create({
      data: { userId: req.userId!, groupId: group.id, role: 'member' },
    });
    res.json(group);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const leaveGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId: id } },
    });
    if (!member) {
      res.status(404).json({ message: '그룹 멤버가 아닙니다.' });
      return;
    }
    if (member.role === 'owner') {
      res.status(400).json({ message: '그룹 오너는 탈퇴할 수 없습니다.' });
      return;
    }

    await prisma.groupMember.delete({
      where: { userId_groupId: { userId: req.userId!, groupId: id } },
    });
    res.json({ message: '그룹에서 탈퇴했습니다.' });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getGroupMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId: id } },
    });
    if (!member) {
      res.status(403).json({ message: '접근 권한이 없습니다.' });
      return;
    }

    const members = await prisma.groupMember.findMany({
      where: { groupId: id },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });
    res.json(members);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
