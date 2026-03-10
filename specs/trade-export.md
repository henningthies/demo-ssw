# Feature: Trade Export

## Hintergrund

Trader muessen ihre Trades regelmaessig exportieren - fuer Compliance-Reports,
Risiko-Analyse und interne Auswertungen. Aktuell muessen sie Daten manuell
aus der Tabelle kopieren.

## Anforderung

Als Trader moechte ich meine Trades als CSV oder Excel exportieren koennen,
gefiltert nach Zeitraum und Status.

## Rahmenbedingungen

- Export laeuft client-seitig (kein Backend-Endpunkt noetig fuer MVP)
- Spaeter: Backend-Export fuer grosse Datenmengen (>10.000 Trades)
- Datumsformat: ISO 8601 fuer CSV, lokalisiert fuer Excel
- Spalten muessen konfigurierbar sein

## Offene Fragen

- Maximale Datenmenge die client-seitig exportiert werden kann?
- Brauchen wir Export-Templates (z.B. "Compliance Report", "P&L Summary")?
- Soll der Export die aktuellen Filter der Tabelle uebernehmen?
