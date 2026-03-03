/**
 * Mock data - temporary until components are updated to use API
 * This file provides empty arrays as placeholders
 */
import type { Order, OrderStatus, DailyStats, MenuStats, HourlyStats } from './types';

// Empty data - should be fetched from API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockOrders: Order[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockDailyStats: DailyStats[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockMenuStats: MenuStats[] = [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockHourlyStats: HourlyStats[] = [];

// Re-export types
export type { Order, OrderStatus };
