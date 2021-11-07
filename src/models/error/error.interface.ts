export interface AppError {
  message: string;
  stack?: string;
  code?: number;
  critical?: Boolean;
}
