interface HeaderProps {
  onOpenHowItWorks: () => void;
}

export function Header({ onOpenHowItWorks }: HeaderProps) {
  return (
    <header>
      <a className="brand" href="#">
        <i>●</i>
        <span>
          <b>NOTEBLOCK</b>
          <small>EARTH JUKEBOX</small>
        </span>
      </a>
      <button type="button" onClick={onOpenHowItWorks}>
        ▤ &nbsp; HOW IT WORKS
      </button>
    </header>
  );
}
