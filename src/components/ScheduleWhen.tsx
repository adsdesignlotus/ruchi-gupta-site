import { isValidHtmlDateTime } from "@/lib/html-datetime";

/** Renders <time dateTime> only when `whenIso` is a valid date; otherwise plain text. */
export function ScheduleWhen({
  when,
  whenIso,
}: {
  when: string;
  whenIso: string;
}) {
  if (isValidHtmlDateTime(whenIso)) {
    return <time dateTime={whenIso}>{when}</time>;
  }
  return <span>{when}</span>;
}
