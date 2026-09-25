export type JobOfferFlag = "talent_pool" | "gone";

export const offerFlagChangedEvent = "jobrater:offer-flag-changed";

export type OfferFlagChangedDetail = {
  jobId: number;
  flag: JobOfferFlag;
  selected: boolean;
};

export function notifyOfferFlagChanged(detail: OfferFlagChangedDetail) {
  window.dispatchEvent(
    new CustomEvent<OfferFlagChangedDetail>(offerFlagChangedEvent, { detail }),
  );
}
