import Link from "next/link";

function Header(props) {
  return <h1>{props.title}</h1>
}

export default function Home() {
  return (
    <div>
        <Header title="Welcome to Private Airdrop!"/>
      <h1 className="title">
        {' '}
        <Link href='/airdrop/commitment'>
          <a>Get Started!</a> 
        </Link>
      </h1>
    </div>
  );
}

