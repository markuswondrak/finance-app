#!/bin/bash

# Das Script bricht ab, wenn ein Befehl fehlschlägt
set -e

# Hilfsfunktion für die Nutzung
usage() {
    echo "Nutzung: $0 <PROJEKT_ID> <SERVICE_ACCOUNT_NAME>"
    echo "Beispiel: $0 finance-app-327108 finanz-app-pipeline-sa"
    exit 1
}

# Überprüfen, ob genügend Argumente übergeben wurden
if [ -z "$1" ] || [ -z "$2" ]; then
    usage
fi

PROJECT_ID=$1
SA_NAME=$2
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="${SA_NAME}-key.json"

echo "--------------------------------------------------------"
echo "Starte Setup für Projekt: $PROJECT_ID"
echo "Service Account Name:     $SA_NAME"
echo "Service Account E-Mail:   $SA_EMAIL"
echo "--------------------------------------------------------"

# 1. Service Account erstellen
# Wir prüfen erst, ob er schon existiert, um Fehler zu vermeiden (optional, aber sauberer)
if gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" > /dev/null 2>&1; then
    echo "⚠️  Service Account '$SA_NAME' existiert bereits. Überspringe Erstellung."
else
    echo "🔨 Erstelle Service Account..."
    gcloud iam service-accounts create "$SA_NAME" \
        --description="Service Account für GitHub Actions" \
        --display-name="GitHub Actions $SA_NAME" \
        --project="$PROJECT_ID"
    echo "✅ Service Account erstellt."
fi

# 2. Rolle zuweisen (Artifact Registry Writer)
echo "🔑 Weise Rolle 'Artifact Registry Writer' zu..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.writer" \
    --condition=None \
    --quiet > /dev/null

echo "✅ Rolle zugewiesen."

# 3. Key erstellen und herunterladen
echo "📥 Generiere JSON Key..."
# Falls eine alte Key-Datei existiert, löschen wir sie vorher nicht, gcloud meckert sonst
if [ -f "$KEY_FILE" ]; then
    echo "⚠️  Datei $KEY_FILE existiert bereits. Bitte manuell löschen oder umbenennen."
    exit 1
fi

gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SA_EMAIL" \
    --project="$PROJECT_ID"

echo "--------------------------------------------------------"
echo "🎉 Fertig!"
echo "Der Key wurde gespeichert in: $(pwd)/$KEY_FILE"
echo ""
echo "Kopiere den Inhalt dieser Datei in dein GitHub Secret:"
echo "cat $KEY_FILE"
echo "--------------------------------------------------------"