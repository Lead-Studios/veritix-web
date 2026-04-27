// FE-074: Conditional location field logic for online and hybrid events

export type EventType = "in-person" | "online" | "hybrid";

export interface LocationFieldVisibility {
  showVenue: boolean;
  showAddress: boolean;
  showEventUrl: boolean;
  showAccessInstructions: boolean;
}

export function getLocationFieldVisibility(eventType: EventType): LocationFieldVisibility {
  return {
    showVenue:              eventType === "in-person" || eventType === "hybrid",
    showAddress:            eventType === "in-person" || eventType === "hybrid",
    showEventUrl:           eventType === "online"    || eventType === "hybrid",
    showAccessInstructions: eventType === "online"    || eventType === "hybrid",
  };
}

export function getLocationValidationRules(eventType: EventType) {
  const v = getLocationFieldVisibility(eventType);
  return {
    venue:               v.showVenue   ? { required: "Venue is required" }   : {},
    address:             v.showAddress ? { required: "Address is required" } : {},
    eventUrl:            v.showEventUrl ? { required: "Event URL is required" } : {},
    accessInstructions:  {},
  };
}