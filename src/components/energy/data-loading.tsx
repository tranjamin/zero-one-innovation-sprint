import {Skeleton} from '@/components/ui/skeleton';
export function DataLoading(){return <div className="page-content" role="status" aria-label="Loading energy data"><Skeleton className="h-12 w-64 mb-8"/><Skeleton className="h-40 w-full mb-6"/><div className="stats-grid">{[0,1,2,3].map(i=><Skeleton key={i} className="h-44 w-full"/>)}</div><Skeleton className="h-80 w-full"/></div>}
