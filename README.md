# 🏫 Schulkasse - Verkaufsverwaltung

Eine moderne, benutzerfreundliche Kassen-Website für schulische Veranstaltungen wie Kuchenverkauf, Basare und andere Verkaufsaktionen.

## ✨ Features

### 🎯 Kernfunktionen
- **Kategorien-Management**: Erstellen, bearbeiten und löschen von Produktkategorien
- **Produkt-Verwaltung**: Produkte mit Preisen und Verfügbarkeiten verwalten
- **Farbanpassung**: Individuelle Farben für jede Kategorie
- **Warenkorb-System**: Intuitive Einkaufsverwaltung mit Mengenänderung
- **Responsive Design**: Funktioniert auf Desktop, Tablet und Smartphone

### 📊 Erweiterte Features
- **Verkaufsstatistiken**: Tagesumsatz, Verkaufsanzahl, beliebteste Produkte
- **Bestandsverwaltung**: Automatische Aktualisierung der verfügbaren Mengen
- **Beleg-Druck**: Professionelle Kassenbelege für Kunden
- **Offline-Funktionalität**: Lokale Datenspeicherung ohne Internetverbindung
- **Steuersatz-Konfiguration**: Anpassbare Steuersätze
- **Mehrere Währungen**: Euro, Dollar, Schweizer Franken

## 🚀 Installation & Nutzung

### Einfache Installation
1. Laden Sie alle Dateien in einen Ordner herunter
2. Öffnen Sie `index.html` in einem modernen Webbrowser
3. Die Website ist sofort einsatzbereit!

### Erste Schritte
1. **Kategorien erstellen**: Klicken Sie auf "Einstellungen" → "Kategorien" → "Neue Kategorie"
2. **Produkte hinzufügen**: Gehen Sie zu "Produkte" → "Neues Produkt"
3. **Verkauf starten**: Klicken Sie auf Produkte, um sie zum Warenkorb hinzuzufügen
4. **Kauf abschließen**: Klicken Sie auf "Kauf abschließen" für den Beleg

## 📱 Verwendung

### Kategorien verwalten
- **Neue Kategorie**: Name eingeben und Farbe wählen
- **Kategorie löschen**: Löscht auch alle zugehörigen Produkte
- **Farbanpassung**: Jede Kategorie hat eine eigene Farbe für bessere Übersicht

### Produkte verwalten
- **Produkt hinzufügen**: Name, Kategorie, Preis und Verfügbarkeit festlegen
- **Bestand**: Automatische Aktualisierung bei Verkäufen
- **Preise**: Dezimalstellen werden automatisch formatiert

### Verkauf durchführen
- **Produkt auswählen**: Klick auf Produkt-Button fügt es zum Warenkorb hinzu
- **Menge ändern**: +/- Buttons im Warenkorb
- **Warenkorb leeren**: "Löschen" Button für neuen Kunden
- **Kauf abschließen**: Automatischer Beleg-Druck und Bestandsaktualisierung

### Statistiken einsehen
- **Tagesumsatz**: Gesamter Umsatz des aktuellen Tages
- **Verkaufsanzahl**: Anzahl der Transaktionen
- **Beliebteste Produkte**: Meistverkaufte Artikel
- **Kategorie-Chart**: Umsatzverteilung nach Kategorien

## 🎨 Anpassungen

### Schulname ändern
1. Einstellungen → Allgemein
2. Schulname eingeben
3. Wird automatisch auf Belegen angezeigt

### Währung ändern
1. Einstellungen → Allgemein
2. Währung auswählen (€, $, CHF)
3. Alle Preise werden automatisch angepasst

### Steuersatz konfigurieren
1. Einstellungen → Allgemein
2. Steuersatz in Prozent eingeben
3. Wird automatisch zum Gesamtpreis addiert

## 💾 Datenspeicherung

- **Lokale Speicherung**: Alle Daten werden im Browser gespeichert
- **Automatisches Speichern**: Änderungen werden sofort gesichert
- **Datenexport**: Verkaufsdaten können über Browser-Entwicklertools exportiert werden
- **Backup**: Regelmäßige Sicherung der localStorage-Daten empfohlen

## 🔧 Technische Details

### Browser-Kompatibilität
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dateistruktur
```
schulkasse/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # Styling und Layout
├── script.js           # JavaScript-Funktionalität
└── README.md           # Diese Anleitung
```

### Technologien
- **HTML5**: Semantische Struktur
- **CSS3**: Moderne Styling mit Flexbox und Grid
- **JavaScript ES6+**: Modulare Klassenarchitektur
- **LocalStorage**: Offline-Datenspeicherung
- **Font Awesome**: Icons
- **Google Fonts**: Inter-Schriftart

## 📋 Beispiel-Szenarien

### Kuchenverkauf
1. Kategorie "Gebäck" erstellen (grün)
2. Produkte: Kuchen (2€), Muffins (1€), Kekse (0,50€)
3. Bestand: 50 Kuchen, 30 Muffins, 100 Kekse
4. Verkauf starten!

### Getränkeverkauf
1. Kategorie "Getränke" erstellen (blau)
2. Produkte: Cola (1€), Wasser (0,50€), Saft (1,20€)
3. Kühlschrank-Bestand eintragen
4. Verkauf durchführen

### Schulbasar
1. Mehrere Kategorien: "Bücher", "Spiele", "Kleidung"
2. Individuelle Farben für jede Kategorie
3. Preise und Verfügbarkeiten festlegen
4. Mehrere Verkäufer können parallel arbeiten

## 🆘 Troubleshooting

### Häufige Probleme

**Website lädt nicht**
- Prüfen Sie, ob alle Dateien im gleichen Ordner sind
- Verwenden Sie einen modernen Browser
- Aktivieren Sie JavaScript

**Daten gehen verloren**
- Browser-Cache leeren kann Daten löschen
- Regelmäßige Backups erstellen
- localStorage-Daten über Entwicklertools sichern

**Beleg wird nicht gedruckt**
- Popup-Blocker deaktivieren
- Drucker-Einstellungen prüfen
- Alternative: Beleg als PDF speichern

### Support
Bei technischen Problemen:
1. Browser-Konsole öffnen (F12)
2. Fehlermeldungen notieren
3. Alle Dateien neu herunterladen
4. Browser-Cache leeren

## 🔄 Updates & Wartung

### Regelmäßige Wartung
- **Daten-Backup**: Monatlich localStorage sichern
- **Browser-Updates**: Aktuelle Version verwenden
- **Datenbereinigung**: Alte Verkaufsdaten archivieren

### Erweiterte Features (geplant)
- [ ] Datenexport als Excel/CSV
- [ ] Mehrere Benutzer mit Passwortschutz
- [ ] Barcode-Scanner-Integration
- [ ] Cloud-Synchronisation
- [ ] Erweiterte Berichte und Analysen

## 📄 Lizenz

Diese Software ist für den schulischen Gebrauch kostenlos verfügbar. 
Kommerzielle Nutzung erfordert eine separate Vereinbarung.

---

**Entwickelt für Schulen, von Schulen** 🏫

*Viel Erfolg bei Ihren Verkaufsaktionen!* 