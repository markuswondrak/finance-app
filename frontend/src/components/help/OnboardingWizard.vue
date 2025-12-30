<template>
  <v-dialog
    v-model="isOpen"
    max-width="700"
    persistent
    scrollable
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h5">{{ currentStep.title }}</span>
        <v-btn
          icon="fa-xmark"
          variant="text"
          size="small"
          @click="skip"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-window v-model="currentStepIndex">
          <v-window-item
            v-for="(step, index) in GUIDE_STEPS"
            :key="index"
            :value="index"
          >
            <div class="pa-6">
              <!-- Icon and description -->
              <div class="d-flex align-start mb-4">
                <v-icon
                  v-if="step.icon"
                  :icon="step.icon"
                  size="32"
                  class="mr-4 mt-1"
                  color="success"
                ></v-icon>
                <div>
                  <p class="text-body-1 mb-0">{{ step.description }}</p>
                </div>
              </div>

              <!-- Screenshot -->
              <div v-if="step.image" class="screenshot-container my-4">
                <v-img
                  :src="step.image"
                  :alt="step.title"
                  height="300"
                  contain
                  class="rounded-lg elevation-2"
                ></v-img>
              </div>

              <!-- Key actions list -->
              <div v-if="step.keyActions && step.keyActions.length > 0" class="mt-4">
                <p class="text-subtitle-2 text-medium-emphasis mb-2">Das kannst du hier tun:</p>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item
                    v-for="(action, actionIndex) in step.keyActions"
                    :key="actionIndex"
                    :prepend-icon="'fa-check'"
                    class="pl-0"
                  >
                    <v-list-item-title class="text-body-2">{{ action }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <!-- Progress indicator -->
        <div class="d-flex align-center">
          <span class="text-caption text-medium-emphasis">
            {{ currentStepIndex + 1 }} / {{ GUIDE_STEPS.length }}
          </span>
        </div>

        <v-spacer></v-spacer>

        <!-- Navigation buttons -->
        <v-btn
          v-if="currentStepIndex > 0"
          variant="text"
          @click="previousStep"
        >
          Zurück
        </v-btn>

        <v-btn
          v-if="!isLastStep"
          color="success"
          @click="nextStep"
        >
          Weiter
        </v-btn>

        <v-btn
          v-else
          color="success"
          @click="finish"
        >
          Fertig
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { userService } from '@/services/user';

// Import onboarding images
import welcomeImg from '@/assets/onboarding/welcome.png';
import overviewImg from '@/assets/onboarding/overview.png';
import wealthImg from '@/assets/onboarding/wealth.png';
import saveToSpendImg from '@/assets/onboarding/save-to-spend.png';
import fixedCostsImg from '@/assets/onboarding/fixed-costs.png';
import specialCostsImg from '@/assets/onboarding/special-costs.png';
import navigationImg from '@/assets/onboarding/navigation.png';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentStepIndex = ref(0);

const GUIDE_STEPS = [
  {
    title: 'Willkommen bei der Finanz-App!',
    icon: 'fa-hand-wave',
    description: 'Diese kurze Anleitung zeigt dir die wichtigsten Funktionen der App. So kannst du schnell loslegen und deine Finanzen im Griff behalten.',
    image: welcomeImg,
    keyActions: [
      'Lerne die fünf Hauptfunktionen kennen',
      'Erfahre, wie du die Navigation nutzt',
      'Starte in wenigen Minuten durch',
    ],
  },
  {
    title: 'Überblick',
    icon: 'fa-chart-line',
    description: 'Der Überblick zeigt dir auf einen Blick, wie sich dein Kontostand entwickeln wird. Du siehst eine Vorschau der nächsten Monate basierend auf deinen Einnahmen und Ausgaben.',
    image: overviewImg,
    keyActions: [
      'Aktuellen Kontostand eintragen',
      'Entwicklung über die nächsten Monate sehen',
      'Niedrigsten erwarteten Punkt erkennen',
    ],
  },
  {
    title: 'Vermögen',
    icon: 'fa-piggy-bank',
    description: 'Im Bereich Vermögen kannst du dein langfristiges Sparziel verfolgen. Trage dein aktuelles Vermögen ein und sieh, wie es sich mit deiner erwarteten Rendite entwickelt.',
    image: wealthImg,
    keyActions: [
      'Aktuelles Vermögen eintragen',
      'Erwartete Rendite festlegen',
      'Zeithorizont für die Prognose wählen',
    ],
  },
  {
    title: 'Spielraum (Save-to-Spend)',
    icon: 'fa-wallet',
    description: 'Der Spielraum zeigt dir, wie viel Geld du diesen Monat noch ausgeben kannst. Die App rechnet automatisch alle fälligen Fixkosten ab und zeigt dir den verfügbaren Betrag.',
    image: saveToSpendImg,
    keyActions: [
      'Aktuellen Kontostand eintragen',
      'Fällige Kosten als bezahlt markieren',
      'Verfügbares Geld für den Monat sehen',
    ],
  },
  {
    title: 'Fixkosten',
    icon: 'fa-money-check-dollar',
    description: 'Hier verwaltest du alle regelmäßigen Einnahmen und Ausgaben. Du kannst monatliche, vierteljährliche, halbjährliche und jährliche Posten anlegen.',
    image: fixedCostsImg,
    keyActions: [
      'Einnahmen (z.B. Gehalt) hinzufügen',
      'Regelmäßige Ausgaben eintragen',
      'Verschiedene Intervalle wählen',
    ],
  },
  {
    title: 'Sonderkosten',
    icon: 'fa-money-bill-wave',
    description: 'Sonderkosten sind einmalige oder unregelmäßige Ausgaben wie Urlaub, Reparaturen oder größere Anschaffungen. Sie werden in der Überblick-Prognose berücksichtigt.',
    image: specialCostsImg,
    keyActions: [
      'Geplante größere Ausgaben eintragen',
      'Erwarteten Monat festlegen',
      'Ausgaben in der Prognose sehen',
    ],
  },
  {
    title: 'Navigation',
    icon: 'fa-bars',
    description: 'Alle Funktionen findest du in der Seitenleiste links. Klicke auf ein Symbol, um zur jeweiligen Funktion zu wechseln. Du kannst die Seitenleiste aufklappen, um die Namen zu sehen.',
    image: navigationImg,
    keyActions: [
      'Seitenleiste aufklappen für mehr Details',
      'Auf dem Handy: Menü-Symbol oben links tippen',
      'Hilfe jederzeit über den Hilfe-Bereich aufrufen',
    ],
  },
];

const currentStep = computed(() => GUIDE_STEPS[currentStepIndex.value]);
const isLastStep = computed(() => currentStepIndex.value === GUIDE_STEPS.length - 1);

const nextStep = () => {
  if (currentStepIndex.value < GUIDE_STEPS.length - 1) {
    currentStepIndex.value++;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const completeOnboarding = async () => {
  try {
    await userService.updateOnboardingStatus(true);
  } catch (error) {
    console.error('Failed to update onboarding status:', error);
  }
};

const finish = async () => {
  await completeOnboarding();
  currentStepIndex.value = 0;
  emit('close');
  isOpen.value = false;
};

const skip = async () => {
  await completeOnboarding();
  currentStepIndex.value = 0;
  emit('close');
  isOpen.value = false;
};
</script>

<style scoped>
.screenshot-container {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px;
}

.v-window {
  min-height: 520px;
}
</style>
