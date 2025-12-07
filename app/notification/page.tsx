"use client";
import Notification from "@/screens/notification";
import { Suspense } from "react";

const NotificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Notification />
    </Suspense>
  );
};

export default NotificationPage;