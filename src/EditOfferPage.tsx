import { Link, useParams } from "react-router-dom";
import AddOfferPage from "./AddOfferPage";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import type { JobOffer } from "./types/job";

type EditOfferPageProps = {
  jobOffers: JobOffer[];
  isLoading: boolean;
  onOfferSaved: () => void;
};

export default function EditOfferPage({
  jobOffers,
  isLoading,
  onOfferSaved,
}: EditOfferPageProps) {
  const { jobId } = useParams();
  const offer = jobOffers.find((job) => job.id === Number(jobId));

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] animate-pulse border-x border-brandgray-250 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-8 w-52 bg-brandgray-150" />
          <div className="mt-8 h-96 bg-brandgray-50" />
        </main>
        <AppFooter />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-brand-950">
            Offer not found
          </h1>
          <Link
            to="/my-offers"
            className="mt-5 inline-flex font-semibold text-brand-900 underline underline-offset-4"
          >
            View your job offers
          </Link>
        </main>
        <AppFooter />
      </div>
    );
  }

  return <AddOfferPage offer={offer} onOfferSaved={onOfferSaved} />;
}
