const GITHUB_LINK = "https://gist.github.com/TalDerei/513712a2fd147183b6cbd8a8c4ea3ac1";

export default function Gist() {
  return (
    <a
      className="gist"
      href={GITHUB_LINK}
      target="_blank"
      rel="noreferrer noopener nofollow"
    >
      <span>Add Commitment To Github Gist!</span>
    </a>
  );
}
