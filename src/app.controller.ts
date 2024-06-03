import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { data, ReportType } from './data';
import { v4 as uuid } from 'uuid';

@Controller('reports/:type')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAllReport(@Param('type') type: string) {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    const response = data.report.filter((report) => report.type === reportType);
    return response;
  }

  @Get(':id')
  getReportById(@Param('type') type: string, @Param('id') id: string) {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    const response = data.report
      .filter((report) => report.type === reportType)
      .find((report) => report.id === id);
    return response;
  }

  @Post()
  createReport(
    @Body() { amount, source }: { amount: number; source: string },
    @Param('type') type: string,
  ) {
    const newReport = {
      id: uuid(),
      amount,
      source,
      created_at: new Date(),
      updated_at: new Date(),
      type: type === 'income' ? ReportType.INCOME : ReportType.EXPENSE,
    };
    data.report.push(newReport);
    return newReport;
  }

  @Patch(':id')
  updateReport(
    @Body() body: { amount: number; source: string },
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    const targetReport = data.report
      .filter((report) => report.type === reportType)
      .find((report) => report.id === id);

    if (!targetReport) return;

    const reportIndex = data.report.findIndex(
      (report) => report.id === targetReport.id,
    );

    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
    };
    return data.report[reportIndex];
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    const updated = data.report.filter((report) => report.id !== id);
    data.report = updated;
    return data.report;
  }
}
