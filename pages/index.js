import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const txt = await f.text();
    setText(txt);
  };

  const analyze = async () => {
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError("Bitte zuerst eine Datei wählen oder Text einfügen.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Analyse fehlgeschlagen");
      setResult(data);
    } catch (e) {
      setError(e.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{maxWidth: 820, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, Arial, sans-serif"}}>
      <h1 style={{marginBottom: 8}}>QuickSafe – Gefährdungsbeurteilung</h1>
      <p style={{color:"#555", marginTop:0}}>
        Lade eine TXT/PDF-Extraktdatei hoch (oder Text einfügen) und klicke auf <b>Analysieren</b>.
      </p>

      <div style={{display:"grid", gap:12, marginTop:16}}>
        <label style={{display:"block"}}>
          <b>Datei wählen</b><br/>
          <input type="file" accept=".txt,.md,.log" onChange={onFile}/>
          {fileName && <div style={{color:"#666", marginTop:4}}>Ausgewählt: {fileName}</div>}
        </label>

        <label style={{display:"block"}}>
          <b>Text (optional bearbeiten / einfügen)</b><br/>
          <textarea
            value={text}
            onChange={(e)=>setText(e.target.value)}
            rows={12}
            placeholder="Hier Text einfügen…"
            style={{width:"100%", fontFamily:"monospace", fontSize:14, padding:10}}
          />
        </label>

        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding:"10px 16px",
            borderRadius:8,
            border:"1px solid #222",
            background: loading ? "#eee" : "#111",
            color: loading ? "#555" : "#fff",
            cursor: loading ? "default" : "pointer",
            width: 180
          }}
        >
          {loading ? "Analysiere…" : "Analysieren"}
        </button>

        {error && <div style={{color:"#b00020"}}>{error}</div>}

        {result && (
          <section style={{marginTop:20}}>
            <h2>Ergebnis</h2>
            <div style={{border:"1px solid #ddd", borderRadius:10, padding:16}}>
              <div><b>Gefahr:</b> {result.gefahr}</div>
              <div><b>Risikostufe:</b> {result.risikostufe}</div>
              <div><b>Norm/Regel:</b> {result.norm}</div>
              <div><b>Empfohlene Maßnahme:</b> {result.massnahme}</div>
            </div>

            {result.hinweise?.length ? (
              <>
                <h3 style={{marginTop:16}}>Weitere Hinweise</h3>
                <ul>
                  {result.hinweise.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
}