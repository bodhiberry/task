import { formatDistanceToNow } from "date-fns";
import { PlusCircle, CheckCircle2, Trash2, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: Date | string;
}

const activityIcons: Record<string, any> = {
  TASK_CREATED: { icon: PlusCircle, color: "text-blue-400 bg-blue-400/10" },
  TASK_UPDATED: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10" },
  TASK_DELETED: { icon: Trash2, color: "text-rose-400 bg-rose-400/10" },
};

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Clock className="w-8 h-8 text-zinc-700 mb-3" />
        <p className="text-sm text-zinc-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => {
        const config = activityIcons[activity.type] || activityIcons.TASK_UPDATED;
        return (
          <div key={activity.id} className="flex gap-4 group">
            <div className={`mt-0.5 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${config.color}`}>
              <config.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{activity.message}</p>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
