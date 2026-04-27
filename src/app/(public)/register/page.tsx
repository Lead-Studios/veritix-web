import { redirect } from 'next/navigation';

export const metadata = {
  title: "Register | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function RegisterPage() {
  redirect('/sign-up');
}
