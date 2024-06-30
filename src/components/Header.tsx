import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  return (
    <div className="border-b bg-gray-50">
      <div className="flex justify-between items-center p-4">
        <div></div>
        <div className="flex items-center gap-2">
          <OrganizationSwitcher
            afterSelectOrganizationUrl="/"
            afterSelectPersonalUrl="/"
          />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
