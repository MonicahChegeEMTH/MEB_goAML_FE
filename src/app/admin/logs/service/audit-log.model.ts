export interface AuditLog {
  id?: string;
  user_id: string;
  username: string;
  action_type: string;
  report_type: string;
  records_retrieved: number;
  created_at: string;
  ip_address: string;
  file?: string;
}