<template>
  <v-navigation-drawer
    id="app-navigation"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
            :rail="rail"
            :temporary="temporary"
            app
            color="surface"
                    >
                      <div class="d-flex align-center pa-2" :class="rail ? 'justify-center' : ''" style="height: 64px;">
                        <v-avatar size="40" class="elevation-2">
                          <v-img src="/finapp_logo.png" alt="Logo"></v-img>
                        </v-avatar>
                        
                                      <div v-if="!rail" class="ml-3 font-weight-bold text-h6">
                                        <span class="text-income">Finanz</span><span class="text-white">-App</span>
                                      </div>                      </div>
                      
                      <v-divider></v-divider>
                  
                      <v-list nav density="compact">
                          <v-list-item
                            v-for="(item, i) in navigationItems"
                            :key="i"
                            :to="item.to"
                            :prepend-icon="item.icon"
                            :title="item.title"
                            active-class="nav-item-active"
                            color="transparent"
                          ></v-list-item>
                      </v-list>
                    </v-navigation-drawer>
                  </template>
                      <script setup>
              import { ref } from 'vue'
              
              defineProps({
                modelValue: {
                  type: [Boolean, null],
                  default: null
                },
                rail: {
                  type: Boolean,
                  default: false
                },
                temporary: {
                  type: Boolean,
                  default: false
                }
              })
              
              defineEmits(['update:modelValue'])
              
              const navigationItems = ref([
                { title: 'Überblick', to: '/overview', icon: 'fa-chart-line' },
                { title: 'Fixkosten', to: '/fixedcosts', icon: 'fa-money-check-dollar' },
                { title: 'Sonderkosten', to: '/specialcosts', icon: 'fa-money-bill-wave' }
              ])
              </script>
              
              <style scoped>
              .nav-item-active {
                position: relative;
                font-weight: bold;
                color: #00E676 !important; /* Mint Green */
              }
              
              .nav-item-active::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background-color: #00E676; /* Mint Green */
                border-radius: 0 4px 4px 0;
                opacity: 1 !important; /* Override potential Vuetify overlays */
              }
              </style>
    