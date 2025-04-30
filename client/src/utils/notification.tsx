import { notification } from "antd";
import type { ArgsProps } from "antd/es/notification";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyOptions extends ArgsProps {
  type?: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  className?: string;
  style?: React.CSSProperties;
}

export const notify = ({
  type = "info",
  message,
  description,
  duration = 4.5,
  placement = "bottomRight",
  className,
  style,
}: NotifyOptions) => {
  notification[type]({
    message,
    description,
    duration,
    placement,
    className,
    style,
  });
};
