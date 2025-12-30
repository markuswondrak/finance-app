# Image Requirements: User Onboarding Guide

**Feature**: 023-user-onboarding-guide
**Date**: 2025-12-30

## Asset Location

```
frontend/src/assets/onboarding/
├── welcome.png
├── overview.png
├── wealth.png
├── save-to-spend.png
├── fixed-costs.png
├── special-costs.png
└── navigation.png
```

## Image Specifications

- **Format**: PNG (for crisp UI screenshots)
- **Recommended width**: 800px (will be scaled responsively)
- **Aspect ratio**: 16:9 or 4:3 (landscape orientation)
- **Theme**: Dark mode (matching app theme)
- **Sample data**: Use realistic but fictional German data

---

## Image List

### 1. welcome.png

**Wizard Step**: Welcome (Step 1 of 7)

**What to show**:
- The app's landing page or main dashboard view
- Sidebar visible (expanded) showing all navigation items
- A friendly, inviting view of the app

**Key elements to highlight**:
- None (this is just an introductory overview)

**Suggested screenshot**:
- Take from Overview page with sidebar expanded
- Shows the full app layout so users understand the structure

---

### 2. overview.png

**Wizard Step**: Überblick (Step 2 of 7)

**What to show**:
- The Overview page (`/overview`)
- Forecast chart with sample data showing balance projection
- The three KPI cards below the chart

**Key elements to capture**:
- [ ] Forecast line chart with visible data points
- [ ] Current Balance card (showing editable balance)
- [ ] Monthly Surplus card with trend indicator
- [ ] Lowest Point card showing risk indicator
- [ ] Sidebar with "Überblick" highlighted/selected

**Sample data suggestions**:
- Current balance: €2.500,00
- Monthly surplus: +€350,00
- Lowest point: €1.200,00 in März

---

### 3. wealth.png

**Wizard Step**: Vermögen (Step 3 of 7)

**What to show**:
- The Wealth Overview page (`/wealth-overview`)
- Three-scenario forecast chart (best/average/worst case)
- Wealth configuration cards

**Key elements to capture**:
- [ ] Wealth forecast chart with three projection lines
- [ ] Current wealth amount card
- [ ] Time horizon card (e.g., "10 Jahre")
- [ ] Expected return rates card (showing %, %, %)
- [ ] Sidebar with "Vermögen" highlighted/selected

**Sample data suggestions**:
- Current wealth: €25.000,00
- Time horizon: 10 Jahre
- Returns: 3% / 5% / 7%

---

### 4. save-to-spend.png

**Wizard Step**: Spielraum (Step 4 of 7)

**What to show**:
- The Save-to-Spend page (`/save-to-spend`)
- Safe to Spend amount prominently displayed
- List of pending costs for the month

**Key elements to capture**:
- [ ] Large "Safe to Spend" amount card (main focus)
- [ ] Current checking balance
- [ ] Pending total amount
- [ ] List of fixed costs with paid/pending status checkboxes
- [ ] At least one cost marked as "paid" and one as "pending"
- [ ] Sidebar with "Spielraum" highlighted/selected

**Sample data suggestions**:
- Checking balance: €3.200,00
- Pending costs: €1.450,00
- Safe to spend: €1.750,00
- Sample costs: Miete (bezahlt), Strom (ausstehend), Netflix (ausstehend)

---

### 5. fixed-costs.png

**Wizard Step**: Fixkosten (Step 5 of 7)

**What to show**:
- The Fixed Costs page (`/fixedcosts`)
- Tab navigation showing different frequencies
- Table with sample fixed costs

**Key elements to capture**:
- [ ] Frequency tabs (Monatlich, Quartalsweise, Halbjährlich, Jährlich)
- [ ] "Monatlich" tab selected
- [ ] Table with several sample costs
- [ ] Add button visible
- [ ] Search/filter bar if visible
- [ ] Sidebar with "Fixkosten" highlighted/selected

**Sample data suggestions**:
- Miete: €950,00 / Monat
- Strom: €85,00 / Monat
- Internet: €45,00 / Monat
- Spotify: €9,99 / Monat
- Versicherung: €120,00 / Quartal (on quarterly tab)

---

### 6. special-costs.png

**Wizard Step**: Sonderkosten (Step 6 of 7)

**What to show**:
- The Special Costs page (`/specialcosts`)
- Mix of expenses and savings entries
- Clear distinction between expense and savings icons

**Key elements to capture**:
- [ ] List/table of special costs
- [ ] At least one expense entry (money-bill-transfer icon)
- [ ] At least one savings entry (piggy-bank icon)
- [ ] Due dates visible
- [ ] Add button visible
- [ ] Sidebar with "Sonderkosten" highlighted/selected

**Sample data suggestions**:
- Urlaub: €1.500,00 (Ausgabe, fällig Juli)
- Neues Laptop: €1.200,00 (Ausgabe, fällig März)
- Notgroschen: €500,00 (Sparen, fällig Dezember)
- Weihnachtsgeschenke: €300,00 (Ausgabe, fällig Dezember)

---

### 7. navigation.png

**Wizard Step**: Navigation (Step 7 of 7)

**What to show**:
- Split view or annotated image showing:
  - Desktop: Expanded sidebar with all menu items labeled
  - Mobile: Hamburger menu or mobile drawer open

**Key elements to capture**:
- [ ] Sidebar in expanded state (showing icons + labels)
- [ ] All 5 main navigation items visible
- [ ] User menu at bottom (profile, settings, logout)
- [ ] Help section highlighted (this will be new)

**Option A - Desktop focus**:
- Full sidebar expanded, clearly showing all navigation options

**Option B - Composite image**:
- Side-by-side: Desktop sidebar | Mobile hamburger menu open

**Recommendation**: Option A (simpler), with mobile mentioned in text

---

## Screenshot Tips

1. **Use incognito/clean browser** to avoid extension interference
2. **Set browser width** to ~1200px for consistent desktop screenshots
3. **Populate with realistic German data** before capturing
4. **Ensure dark theme is active** (should be default)
5. **Capture at 2x resolution** if possible (Retina) for crisp display
6. **Crop to remove browser chrome** (just the app content)

## Checklist Before Delivery

- [ ] All 7 images created
- [ ] All images in PNG format
- [ ] All images placed in `frontend/src/assets/onboarding/`
- [ ] Filenames match exactly (lowercase, hyphens)
- [ ] Dark theme visible in all screenshots
- [ ] Sample data is in German
- [ ] No personal/real financial data visible
