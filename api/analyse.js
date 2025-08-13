export default function handler(req, res) {
  res.status(200).json({
    danger: 'Einzugsgefahr durch offene Riemenscheibe',
    risk: 'Hoch',
    norm: 'EN ISO 13857',
    action: 'Schutzhaube montieren'
  });
}