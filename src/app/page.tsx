import ComputerSite from "./computerSite";
import MobileSite from "./mobileSite";

export default function Home() {
  return (
    <div>
      <div className="md:block hidden">
        <ComputerSite />
      </div>
      <div className="md:hidden block">
        <MobileSite />
      </div>
    </div>
  );
}
