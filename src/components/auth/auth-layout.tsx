import Image from "next/image";
import BackButton from "./back-button";

const BrandContent = () => (
  <div className="h-48 lg:h-full rounded-3xl relative bg-primary-dark-blue p-8 flex flex-col justify-between overflow-hidden">
    <div className="z-40 flex justify-between items-center">
      <h3 className="text-lg md:text-2xl font-semibold text-white">Veritix</h3>
      <BackButton />
    </div>

    <div className="z-40 flex-1 flex flex-col justify-end text-center text-white mb-10 lg:mb-20">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
        Start Your Event Journey 🚀
      </h1>
      <p className="text-gray-300 text-sm md:text-lg mx-auto lg:px-5 hidden sm:block">
        Sign up to unlock NFT tickets, crypto rewards, and exclusive access. Your adventure in live events and Web3 begins here!
      </p>
    </div>

    <Image
      src="/ellipse-20.svg"
      alt=""
      aria-hidden="true"
      width={500}
      height={300}
      className="absolute -top-5 left-0 w-fit"
    />

    <Image
      src="/ellipse-19.svg"
      alt=""
      aria-hidden="true"
      width={500}
      height={300}
      className="absolute -bottom-5 right-0 w-fit"
    />

    <Image
      src="/auth-layout-img.svg"
      alt=""
      aria-hidden="true"
      width={500}
      height={300}
      className="absolute -bottom-5 -right-20 w-80 hidden sm:block"
    />
  </div>
);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary-light-blue flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl py-4">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="block lg:hidden">
            <BrandContent />
          </div>

          <div className="px-0 py-6 md:px-2 lg:p-12 flex flex-col justify-center">
            {children}
          </div>

          <div className="hidden lg:block">
            <BrandContent />
          </div>
        </div>
      </div>
    </div>
  );
}
