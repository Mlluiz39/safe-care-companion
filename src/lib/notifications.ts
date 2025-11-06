export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
};

export const scheduleMedicationReminder = (medicationName: string, time: string) => {
  const now = new Date();
  const [hours, minutes] = time.split(":");
  const scheduledTime = new Date(now);
  scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendNotification("Hora do Medicamento! 💊", {
      body: `É hora de tomar ${medicationName}`,
      tag: `medication-${medicationName}-${time}`,
      requireInteraction: true,
    });
  }, timeUntilNotification);
};

export const scheduleAppointmentReminder = (appointmentTitle: string, appointmentDate: Date) => {
  const now = new Date();
  const reminderTime = new Date(appointmentDate);
  reminderTime.setHours(reminderTime.getHours() - 1); // 1 hora antes

  if (reminderTime <= now) {
    return;
  }

  const timeUntilNotification = reminderTime.getTime() - now.getTime();

  setTimeout(() => {
    sendNotification("Lembrete de Consulta 📅", {
      body: `${appointmentTitle} em 1 hora`,
      tag: `appointment-${appointmentDate.toISOString()}`,
      requireInteraction: true,
    });
  }, timeUntilNotification);
};
