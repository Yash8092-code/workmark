import { useMemo } from 'react';
import { Bell, CheckCheck, Sparkles, Clock } from 'lucide-react';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '../hooks/useNotifications';
import { Button } from '../components/ui/Button';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { isToday, formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { data, isLoading, isError } = useNotifications({ limit: 50 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const notifications = data?.data ?? [];

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <Bell className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Activity Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Notifications</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Real-time alerts regarding applications, matches, and profile activity.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={unreadCount === 0 || markAllAsRead.isPending}
            className="rounded-xl font-bold self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            <span>Mark all read ({unreadCount})</span>
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-[#E2E8F0] animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm">
            Notifications are temporarily unavailable.
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
              <Bell className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">You're all caught up</h2>
            <p className="text-sm text-[#64748B]">New updates regarding your applications and matches will appear here.</p>
          </div>
        )}

        {/* Today's Section */}
        {todayNotifications.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-1">Today</h2>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B] px-1">Earlier</h2>
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
  const isUnread = !notification.read;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
        isUnread
          ? 'bg-blue-50/40 border-blue-200 shadow-xs'
          : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
      }`}
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
          isUnread ? 'bg-blue-600 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
        }`}
      >
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-bold text-[#0F172A] ${isUnread ? 'text-blue-950' : ''}`}>
            {notification.title}
          </h3>
          <span className="text-[11px] text-[#64748B] flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">{notification.message}</p>

        {isUnread && (
          <button
            type="button"
            className="text-xs font-bold text-blue-600 mt-2 hover:underline cursor-pointer"
            onClick={onMarkRead}
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
