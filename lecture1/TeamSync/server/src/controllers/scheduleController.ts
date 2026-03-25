import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myGroupIds = await prisma.groupMember.findMany({
      where: { userId: req.userId },
      select: { groupId: true },
    });
    const groupIds = myGroupIds.map((m) => m.groupId);

    const schedules = await prisma.schedule.findMany({
      where: {
        OR: [
          { userId: req.userId },
          {
            groups: {
              some: { groupId: { in: groupIds } },
            },
          },
        ],
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        groups: {
          include: {
            group: { select: { id: true, name: true, color: true } },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
    res.json(schedules);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, startDate, endDate, isAllDay, groupIds } = req.body;
    if (!title || !startDate || !endDate) {
      res.status(400).json({ message: '제목, 시작일, 종료일은 필수입니다.' });
      return;
    }

    if (groupIds && groupIds.length > 0) {
      const memberCheck = await prisma.groupMember.findMany({
        where: { userId: req.userId, groupId: { in: groupIds } },
      });
      if (memberCheck.length !== groupIds.length) {
        res.status(403).json({ message: '가입하지 않은 그룹에는 공유할 수 없습니다.' });
        return;
      }
    }

    const schedule = await prisma.schedule.create({
      data: {
        userId: req.userId!,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAllDay: isAllDay ?? false,
        groups: {
          create: (groupIds || []).map((groupId: string) => ({ groupId })),
        },
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        groups: {
          include: { group: { select: { id: true, name: true, color: true } } },
        },
      },
    });
    res.status(201).json(schedule);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      res.status(404).json({ message: '스케줄을 찾을 수 없습니다.' });
      return;
    }
    if (schedule.userId !== req.userId) {
      res.status(403).json({ message: '수정 권한이 없습니다.' });
      return;
    }

    const { title, description, startDate, endDate, isAllDay, groupIds } = req.body;

    await prisma.scheduleGroup.deleteMany({ where: { scheduleId: id } });

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAllDay: isAllDay ?? false,
        groups: {
          create: (groupIds || []).map((groupId: string) => ({ groupId })),
        },
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        groups: {
          include: { group: { select: { id: true, name: true, color: true } } },
        },
      },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) {
      res.status(404).json({ message: '스케줄을 찾을 수 없습니다.' });
      return;
    }
    if (schedule.userId !== req.userId) {
      res.status(403).json({ message: '삭제 권한이 없습니다.' });
      return;
    }

    await prisma.schedule.delete({ where: { id } });
    res.json({ message: '스케줄이 삭제되었습니다.' });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
