import { useState, useMemo, useRef, useEffect } from "react"
import confetti from "canvas-confetti"
import "./App.css"

function TypeText({ text, speed = 70, pause = 700, sound = true, className = "", onDone }) {
  const [out, setOut] = useState("")
  const [cursor, setCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio("/assets/type.mp3")
    audioRef.current.volume = 0.15
  }, [])

  useEffect(() => {
    let stopped = false
    setOut("")
    setIsTyping(true)
    const sentences = text.split("\n\n")
    let sIndex = 0
    let cIndex = 0

    const type = () => {
      if (stopped) return
      const current = sentences[sIndex]
      if (cIndex < current.length) {
        const ch = current.charAt(cIndex)
        setOut(p => p + ch)
        if (sound && audioRef.current && ch !== " ") {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
        cIndex++
      } else {
        sIndex++
        cIndex = 0
        if (sIndex >= sentences.length) {
          setIsTyping(false)
          onDone && onDone()
          return
        }
        setOut(p => p + "\n\n")
      }
    }

    const interval = setInterval(type, speed)
    return () => {
      stopped = true
      clearInterval(interval)
    }
  }, [text, speed, pause, sound, onDone])

  useEffect(() => {
    if (!isTyping) return
    const c = setInterval(() => setCursor(p => !p), 500)
    return () => clearInterval(c)
  }, [isTyping])

  return (
    <div className={className} style={{ whiteSpace: "pre-line" }}>
      {out}
      {isTyping && <span className="cursor">{cursor ? "|" : " "}</span>}
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState("ask")
  const [noPos, setNoPos] = useState({ top: "70px", left: "160px" })
  const [noCount, setNoCount] = useState(0)
  const [showByeBtn, setShowByeBtn] = useState(false)
  const [giftDone, setGiftDone] = useState(false)
  const [byeDone, setByeDone] = useState(false)
  const lock = useRef(false)
  const bgMusic = useRef(null)
  const musicStarted = useRef(false)

  const proposalVideos = [
    "/assets/propose1.mp4",
    "/assets/propose2.mp4",
    "/assets/propose3.mp4",
    "/assets/propose4.mp4",
    "/assets/propose5.mp4",
  ]

  useEffect(() => {
    bgMusic.current = new Audio("/assets/bg.mp3")
    bgMusic.current.loop = true
    bgMusic.current.volume = 0.25
  }, [])

  const startMusic = () => {
    if (musicStarted.current) return
    musicStarted.current = true
    bgMusic.current.play().catch(() => {})
  }

  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  )

  const moveNo = () => {
    if (lock.current) return
    lock.current = true
    navigator.vibrate && navigator.vibrate(30)
    setNoCount(p => p + 1)

    setTimeout(() => {
      lock.current = false
    }, 900)

    const box = document.querySelector(".buttons")
    const yes = document.querySelector(".yes")
    if (!box || !yes) return
    const b = box.getBoundingClientRect()
    const y = yes.getBoundingClientRect()
    let x, yPos
    do {
      x = Math.random() * (b.width - 100) + 10
      yPos = Math.random() * (b.height - 50) + 10
    } while (Math.hypot(b.left + x - y.left, b.top + yPos - y.top) < 90)

    setNoPos({ left: `${x}px`, top: `${yPos}px` })
  }

  const accept = () => {
    startMusic()
    confetti({
      particleCount: 220,
      spread: 90,
      shapes: ["heart"],
      colors: ["#ff4d6d", "#ff85a1", "#ffb3c6"],
    })
    setStage("after")
  }

  const currentProposal =
    noCount === 0
      ? "/assets/beforeyes.mp4"
      : proposalVideos[(noCount - 1) % proposalVideos.length]

  return (
    <div className="valentine">
      {hearts.map((h, i) => (
        <div key={i} className="heart" style={{ left: h.left, animationDelay: h.delay }}>
          ❤️
        </div>
      ))}

      {stage === "ask" && (
        <div className="card">
          <TypeText text="💌 Sudar! you will be my Girlfriend?" speed={65} />

          <div className="media">
            <video src={currentProposal} autoPlay muted loop playsInline />
          </div>

          <div className="buttons">
            <button className="yes" onClick={accept}>YES 💖</button>
            <button
              className="no"
              style={noPos}
              onMouseEnter={moveNo}
              onTouchStart={e => { e.preventDefault(); moveNo() }}
            >
              NO 💔
            </button>
          </div>
        </div>
      )}

      {stage === "after" && (
        <div className="card done">
          <div className="media">
            <video src="/assets/afteryes.mp4" autoPlay muted loop playsInline />
          </div>
          <TypeText
            text="Haan… Vaazhthukkal Vaazhtukkal 💐 You are officially my girlfriend 🤍"
            speed={75}
            onDone={() => setTimeout(() => setStage("gift"), 1800)}
          />
        </div>
      )}

      {stage === "gift" && (
        <div className="gift-card">
          <TypeText text="🎁 A Little From My Heart" speed={80} />
          <div className="gift-frame">
            <img src="/assets/mygirl.png" alt="" />
          </div>

          {!giftDone ? (
            <TypeText
              text={`Although you have already said no, I find myself lingering in a space of unanswered emotions, uncertain of their origin yet unable to dismiss them.

I respect your feelings and your decision without reservation. Nothing I feel seeks to alter that truth.

Still, with quiet sincerity, I love you.

You were a very nice girl. Thank you for being nice 🤍`}
              speed={65}
              onDone={() => { setGiftDone(true); setShowByeBtn(true) }}
            />
          ) : (
            <div style={{ whiteSpace: "pre-line" }}>
              Although you have already said no, I find myself lingering in a space of unanswered emotions, uncertain of their origin yet unable to dismiss them.

              I respect your feelings and your decision without reservation. Nothing I feel seeks to alter that truth.

              Still, with quiet sincerity, I love you.

              You were a very nice girl. Thank you for being nice 🤍
            </div>
          )}

          {showByeBtn && (
            <button className="bye-btn" onClick={() => setStage("bye")}>
              Bye 👋
            </button>
          )}
        </div>
      )}

      {stage === "bye" && (
        <div className="bye-page">
          <div className="media">
            <video src="/assets/bye.mp4" autoPlay muted loop playsInline />
          </div>
          {!byeDone ? (
            <TypeText
              text="Always wishing you happiness. This was fun, don’t take it seriously. Take care 🌸"
              speed={85}
              onDone={() => setByeDone(true)}
            />
          ) : (
            <div style={{ whiteSpace: "pre-line" }}>
              Always wishing you happiness. This was fun, don’t take it seriously.

              Take care 🌸
            </div>
          )}
        </div>
      )}
    </div>
  )
}
