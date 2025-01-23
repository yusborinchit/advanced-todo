interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "Advanced Todo | Sign In",
};

export default function SignInLayout({ children }: Readonly<Props>) {
  return children;
}
