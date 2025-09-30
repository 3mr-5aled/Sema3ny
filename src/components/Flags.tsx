// Flag SVG components
export function USFlag({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink"
      width="1235"
      height="650"
      viewBox="0 0 7410 3900"
    >
      <path d="M0,0h7410v3900H0" fill="#b31942" />
      <path
        d="M0,450H7410m0,600H0m0,600H7410m0,600H0m0,600H7410m0,600H0"
        stroke="#FFF"
        stroke-width="300"
      />
      <path d="M0,0h2964v2100H0" fill="#0a3161" />
      <g fill="#FFF">
        <g id="s18">
          <g id="s9">
            <g id="s5">
              <g id="s4">
                <path
                  id="s"
                  d="M247,90 317.534230,307.082039 132.873218,172.917961H361.126782L176.465770,307.082039z"
                />
                <use xlinkHref="#s" y="420" />
                <use xlinkHref="#s" y="840" />
                <use xlinkHref="#s" y="1260" />
              </g>
              <use xlinkHref="#s" y="1680" />
            </g>
            <use xlinkHref="#s4" x="247" y="210" />
          </g>
          <use xlinkHref="#s9" x="494" />
        </g>
        <use xlinkHref="#s18" x="988" />
        <use xlinkHref="#s9" x="1976" />
        <use xlinkHref="#s5" x="2470" />
      </g>
    </svg>
  )
}

export function UKFlag({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          stroke="#C8102E"
          strokeWidth="4"
          clipPath="url(#t)"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}
