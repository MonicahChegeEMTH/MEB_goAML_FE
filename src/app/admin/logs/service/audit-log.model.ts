export interface AuditLog {
  user_id: string;
  username: string;
  action_type: string;
  report_type: string;
  records_retrieved: number;
  ip_address: string;
  file?: string;
}