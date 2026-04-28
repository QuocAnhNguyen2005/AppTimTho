import { ReactNode } from 'react';
import WorkerLayoutClient from './WorkerLayoutClient';

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return <WorkerLayoutClient>{children}</WorkerLayoutClient>;
}
