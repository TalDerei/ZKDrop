import Link from "next/link";
import { Button } from "reactstrap";

export default function Home() {
  return (
    <div class="homepage-buttons">
        <Link href='/airdrop/enter' passHref>
          <button class="button button1 enter">ENTER LOTTERY DRAWING</button>
        </Link>
        <Link href='/airdrop/commitment' passHref>
          <button class="button button2 draw">CHECK LOTTERY STATUS </button>
        </Link>
        <Link href='/airdrop/test' passHref>
          <button class="button button2 button-draw draw-2">SAMPLE LOTTERY</button>
        </Link>
    </div>
  );
}