import { redirect } from "next/navigation";

export default function CreateMyEventRedirect() {
  redirect("/events/create");
}
