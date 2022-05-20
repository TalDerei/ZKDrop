import Link from "next/link";
import { Button } from "reactstrap";

export default function Home() {
  return (
    <div>
        <Link href='/airdrop/wager' passHref>
          <button class="button button1 enter">ENTER LOTTERY DRAWING</button>
        </Link>
        <Link href='/airdrop/commitment' passHref>
          <button class="button button2 draw">CHECK LOTTERY STATUS </button>
        </Link>
    </div>
  );
}