// Einfache Offline-Analyse (keine externen Dienste nötig)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST wird unterstützt." });
  }

  const { text = "" } = req.body || {};
  const t = String(text).toLowerCase();

  // sehr simple Heuristik – reicht für Demo / PoC
  let gefahr = "Allgemeine Arbeitsplatzgefahr";
  let risikostufe = "Niedrig";
  let norm = "ArbSchG §5 (Gefährdungsbeurteilung)";
  let massnahme = "Unterweisung, Sichtprüfung, PSA prüfen";
  const hinweise = [];

  const hit = (kw) => kw.some(k => t.includes(k));

  if (hit(["leiter", "sturz", "höhe", "stolpern"])) {
    gefahr = "Sturz / Stolpern";
    risikostufe = "Mittel";
    norm = "DGUV Regel 112-198 / TRBS 2121";
    massnahme = "Leitern sichern, Absturzsicherung, Wege freihalten";
    hinweise.push("Rutschhemmende Schuhe prüfen.");
  }

  if (hit(["strom", "elektr", "kabel", "steckdose"])) {
    gefahr = "Elektrische Gefährdung";
    risikostufe = "Hoch";
    norm = "DGUV Vorschrift 3 / DIN VDE 0100";
    massnahme = "Wiederkehrende Prüfung, nur Elektrofachkräfte, Kennzeichnung";
    hinweise.push("Defekte Leitungen sofort außer Betrieb nehmen.");
  }

  if (hit(["lärm", "laerm", "schall", "dB", "db"])) {
    gefahr = "Lärmexposition";
    risikostufe = "Mittel";
    norm = "TRLV Lärm / LärmVibrationsArbSchV";
    massnahme = "Gehörschutz bereitstellen & benutzen, Expositionszeit reduzieren";
  }

  if (hit(["chem", "lösemittel", "gas", "dampf"])) {
    gefahr = "Gefahrstoffe";
    risikostufe = "Hoch";
    norm = "GefStoffV / TRGS 400 ff.";
    massnahme = "SDB beachten, Lüften/Absaugung, geeignete PSA";
  }

  return res.status(200).json({ gefahr, risikostufe, norm, massnahme, hinweise });
}