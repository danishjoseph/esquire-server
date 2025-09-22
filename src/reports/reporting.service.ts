import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

type Repository = {
  getCountForPeriod: (start: Date, end: Date) => Promise<number>;
};

export interface GrowthMetrics {
  total: number;
  monthlyGrowth: number;
  currentMonthCount: number;
}

@Injectable()
export class ReportingService {
  async calculateGrowthForEntity(
    repository: Repository,
  ): Promise<Pick<GrowthMetrics, 'monthlyGrowth' | 'currentMonthCount'>> {
    const now = dayjs();

    const startOfCurrentMonth = now.startOf('month').toDate();
    const endOfCurrentMonth = now.add(1, 'month').startOf('month').toDate();

    const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = now.startOf('month').toDate();

    const currentMonthCount = await repository.getCountForPeriod(
      startOfCurrentMonth,
      endOfCurrentMonth,
    );

    const lastMonthCount = await repository.getCountForPeriod(
      startOfLastMonth,
      endOfLastMonth,
    );

    let growth: number;
    if (lastMonthCount === 0) {
      growth = currentMonthCount > 0 ? 100 : 0;
    } else {
      growth = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    }

    return {
      monthlyGrowth: growth,
      currentMonthCount,
    };
  }
}
