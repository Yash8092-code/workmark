import { useMemo } from 'react';
import { Bell, CheckCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { isToday, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
  const { data, isLoading, isError } = useNotifications({ limit: 50 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const notifications = data?.data ?? [];

  const unreadCount = useMemo(
    () => notifications.filter((n) => !(n.isRead ?? n.read)).length,
    [notifications]
  );

  // Group notifications into Today and Earlier
  const { todayNotifications, earlierNotifications } = useMemo(() => {
    const today: typeof notifications = [];
    const earlier: typeof notifications = [];

    notifications.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      if (isToday(createdAt)) {
        today.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { todayNotifications: today, earlierNotifications: earlier };
  }, [notifications]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="genz-card-raised p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 mb-2 border border-indigo-500/30">
              <Bell className="h-3.5 w-3.5" />
              Activity Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Notifications</h1>
            <p className="text-sm font-medium text-slate-300 mt-0.5">
              Real-time updates regarding your applications, stages, and interviews.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={unreadCount === 0 || markAllAsRead.isPending}
            className="self-start sm:self-auto rounded-2xl text-xs font-bold bg-slate-900 border-white/10 text-slate-200 hover:text-white hover:bg-slate-800"
          >
            <CheckCheck className="h-4 w-4 mr-1.5" />
            <span>Mark all read ({unreadCount})</span>
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 genz-card rounded-3xl animate-pulse bg-slate-900/60" />
            ))}
          </div>
        )}

        {isError && (
          <div className="genz-card rounded-3xl p-6 bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-300">
            Notifications are temporarily unavailable.
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="genz-card rounded-3xl p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <Bell className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-black text-white mb-1">You're all caught up</h2>
            <p className="text-sm font-medium text-slate-400">New updates regarding your applications and matches will appear here.</p>
          </div>
        )}

        {/* Today's Section */}
        {todayNotifications.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">Today</h2>
            {todayNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={() => markAsRead.mutate(notification._id)}
              />
            ))}
          </div>
        )}

        {/* Earlier Section */}
        {earlierNotifications.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">Earlier</h2>
            {earlierNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkRead={() => markAsRead.mutate(notification._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: any;
  onMarkRead: () => void;
}) {
  const navigate = useNavigate();
  const isUnread = !(notification.isRead ?? notification.read);

  const handleClick = () => {
    if (isUnread) {
      onMarkRead();
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={`genz-card rounded-3xl p-5 transition-all flex items-start gap-4 border cursor-pointer hover:scale-[1.01] ${
        isUnread
          ? 'border-cyan-500/40 bg-slate-900/80 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
          : 'border-white/5 bg-slate-900/40 hover:border-white/15'
      }`}
    >
      <div
        className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
          isUnread
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
            : 'bg-slate-800/80 text-slate-400 border-white/5'
        }`}
      >
        <Sparkles className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-black ${isUnread ? 'text-cyan-300' : 'text-white'}`}>
            {notification.title}
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1 leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-4 mt-3">
          {notification.link && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
              <span>View details</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          )}

          {isUnread && (
            <button
              type="button"
              className="text-xs font-bold text-slate-400 hover:text-white hover:underline cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
