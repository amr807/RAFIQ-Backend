
export const DbConnections = {
  AUTH: process.env.DB_NAME_Auth ,
  TASK: process.env.DB_NAME_task ,
  NOTIFICATION: process.env.DB_NAME_notification ,
  PROD: process.env.DB_NAME_PROD ,
} as const;

export function getConnections(db: (typeof DbConnections)[keyof typeof DbConnections]): string | undefined {
  const mode = process.env.MODE;
  if (mode === 'prod') return undefined;
  return db as string;
}
