import { useState, useMemo, useRef, useEffect } from "react"
import confetti from "canvas-confetti"
import "./App.css"
function TypeText({text,speed=70,sound=true,className="",onDone }) {
  const [out,setOut]=useState("")
  const [cursor,setCursor]=useState(true)
  const audioRef=useRef(null)
  useEffect(()=>{
    audioRef.current=new Audio("/assets/type.mp3")
    audioRef.current.volume=0.15
  },[])
  useEffect(()=>{
    let i=0
    setOut("")
    const interval=setInterval(()=>{
      if (i<text.length) {
        const ch=text[i]
        setOut((p)=>p+ch)
        if (sound && audioRef.current&&ch!==" "){
          audioRef.current.currentTime=0
          audioRef.current.play().catch(()=>{})
        }
        i++
      }else{
        clearInterval(interval)
        onDone&&onDone()
      }
    },speed)
    return()=>clearInterval(interval)
  },[text,speed,sound,onDone])
  useEffect(()=>{
    const c=setInterval(()=>setCursor((p)=>!p),500)
    return()=>clearInterval(c)
  },[])
  return (
    <div className={className}style={{whiteSpace:"pre-line" }}>
      {out}
      <span className="cursor">{cursor ? "|" : " "}</span>
    </div>
  )
}
export default function App() {
  const [stage, setStage] = useState("introVideo")
  const [noMode, setNoMode] = useState(false) // ⭐ CHANGE 1 (keep)
  const [showvarataaaBtn, setShowvarataaaBtn] = useState(false)
  const [giftDone, setGiftDone] = useState(false)
  const [varataaaDone, setvarataaaDone] = useState(false)
  const bgMusic = useRef(null)
  const introAudio = useRef(null)
  const noAudio = useRef(null)
  const image2Ref = useRef(null)
  useEffect(() => {
    bgMusic.current = new Audio("/assets/bg.mp3")
    bgMusic.current.loop = true
    bgMusic.current.volume = 0.25

    introAudio.current = new Audio("/assets/audio1.mp3")
    noAudio.current = new Audio("/assets/audio2.mp3")
  }, [])
  const startIntro = () => {
    introAudio.current.play().catch(() => {})
    setStage("introImage")
    setTimeout(() => {
      setStage("ask")
    }, 2000)
  }
  const startMusic = () => {
    bgMusic.current?.play().catch(() => {})
  }
  const handleNo = () => {
    if (noMode) return
    setNoMode(true)
    noAudio.current.currentTime = 0
    noAudio.current.play().catch(() => {})
    setTimeout(() => {
      image2Ref.current?.play()
    }, 50)
  }
  const accept = () => {
    startMusic()
    confetti({ particleCount: 220, spread: 90, shapes: ["heart"] })
    setStage("after")
  }
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  )
  return (
    <div className="kadhali">
      {hearts.map((h, i) => (
        <div key={i} className="heart" style={{ left: h.left, animationDelay: h.delay }}>
          ❤️
        </div>
      ))}
      {stage === "introVideo" && (
        <div className="intro-full" onClick={startIntro}>
          <video
            src="/assets/intro.mp4"
            autoPlay
            muted
            playsInline
            className="intro-video"
          />
        </div>
      )}
      {stage === "introImage" && (
        <div className="card">
          <div className="media">
            <img src="/assets/image1.png" alt="" />
          </div>
        </div>
      )}
     {stage === "ask" && (
        <div className="card">
          {!noMode && (
            <>
              <TypeText text="💌 RP! will you marry me?" speed={65} />
              <div className="media">
                <video src="/assets/beforeyes.mp4" autoPlay muted loop playsInline />
              </div>
            </>
          )}
          {noMode && (
            <div className="media">
              <video ref={image2Ref} src="/assets/image2.mp4" playsInline />
            </div>
          )}
          <div className="buttons">
            <button
              className="yes"
              onClick={accept}
              style={{
                position: noMode ? "absolute" : "relative",
                left: noMode ? "50%" : "0",
                top: noMode ? "50%" : "0",
                transform: noMode
                  ? "translate(-50%,-50%) scale(1.6)"
                  : "scale(1)"
              }}
            >
              YES 💖
            </button>
            {!noMode && (
              <button className="no" onClick={handleNo}>
                NO 💔
              </button>
            )}
          </div>
        </div>
      )}  
      {stage === "after" && (
        <div className="card done">
          <div className="media">
            <video src="/assets/afteryes.mp4" autoPlay muted loop playsInline />
          </div>
          <TypeText
            text="Haan… Vaazhthukkal 💐 You are officially my pondatti 🤍"
            speed={75}
            onDone={() => setTimeout(() => setStage("gift"), 1800)}
          />
        </div>
      )}
      {stage === "gift" && (
        <div className="gift-card">
          <TypeText text="🎁 A Words From My Heart" speed={80} />
          <div className="gift-frame">
            <img src="/assets/mygirl.png" alt="" />
          </div>
          {!giftDone ? (
            <TypeText
              text={`Every moment with you feels like a dream I never want to wake from ❤️.

You are my smile, my joy, and my everything 💕.

My heart beats for you, today and always ❤️.

With you, every day is Valentine’s Day 💖.

You’re my favorite hello and my hardest goodbye 💘"`}
              speed={65}
              onDone={() => { setGiftDone(true); setShowvarataaaBtn(true) }}
            />
          ) : (
            <div style={{ whiteSpace: "pre-line" }}>
              Every moment with you feels like a dream I never want to wake from ❤️.

You are my smile, my joy, and my everything 💕.

My heart beats for you, today and always ❤️.

With you, every day is Valentine’s Day 💖.

You’re my favorite hello and my hardest goodbye 💘
            </div>
          )}
          {showvarataaaBtn && (
            <button className="varataaa-btn" onClick={() => setStage("varataaa")}>
              byee 👋
            </button>
          )}
        </div>
      )}
      {stage === "varataaa" && (
        <div className="varataaa-page">
          <div className="media">
            <video src="/assets/varataaa.mp4" autoPlay muted loop playsInline />
          </div>
          {!varataaaDone ? (
            <TypeText
              text="Always wishing you happiness. Take care maa...🌸"
              speed={85}
              onDone={() => setvarataaaDone(true)}
            />
          ) : (
            <div style={{ whiteSpace: "pre-line" }}>
              Always wishing you happiness. Take care maa..🌸
            </div>
          )}
        </div>
      )}
    </div>
  )
}
